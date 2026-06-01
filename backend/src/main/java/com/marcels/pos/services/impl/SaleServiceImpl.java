package com.marcels.pos.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marcels.pos.models.entities.Sale;
import com.marcels.pos.models.entities.SaleDetail;
import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.SaleDetailRepository;
import com.marcels.pos.models.repositories.SaleRepository;
import com.marcels.pos.models.repositories.StockRepository;
import com.marcels.pos.services.SaleService;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository saleDetailRepository;
    private final StockRepository stockRepository;

    public SaleServiceImpl(SaleRepository saleRepository, 
                           SaleDetailRepository saleDetailRepository, 
                           StockRepository stockRepository) {
        this.saleRepository = saleRepository;
        this.saleDetailRepository = saleDetailRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    @Transactional // ¡All-or-Nothing! Si algo falla o no hay stock, se revierte todo de Neon automáticamente
    public Sale saveSale(Sale sale) {
        // 1. Validar que la venta contenga productos en su estructura
        if (sale.getSaleDetails() == null || sale.getSaleDetails().isEmpty()) {
            throw new IllegalArgumentException("Cannot process a sale without products.");
        }

        // 2. Asegurar que la fecha se registre al momento exacto de la transacción en el servidor
        if (sale.getDateSale() == null) {
            sale.setDateSale(LocalDateTime.now());
        }

        // 3. ¡EL PASO CLÍTICO CRUCIAL!: Enlazar cada detalle con el objeto Venta Padre
        // Esto previene el error 500 al evitar que Hibernate intente insertar 'id_sale' como NULL en Neon
        for (SaleDetail detail : sale.getSaleDetails()) {
            detail.setSale(sale);
        }

        // 4. Validar disponibilidad de inventario para todos los productos solicitados
        validateStockAvailability(sale.getSaleDetails());

        // 5. Restar de forma segura las unidades de la tabla de Inventario (tbl_stocks)
        updateInventoryStock(sale.getSaleDetails());

        // 6. Guardar la estructura unificada en la base de datos (Guarda cabecera y detalles en cascada)
        return saleRepository.save(sale);
    }

    // --- MÉTODOS PRIVADOS ESPECIALIZADOS (CLEAN CODE) ---

    private void validateStockAvailability(List<SaleDetail> details) {
        for (SaleDetail detail : details) {
            Stock stock = stockRepository.findByProduct(detail.getProduct())
                    .orElseThrow(() -> new RuntimeException("Inventory record missing for product ID: " 
                            + detail.getProduct().getIdProduct()));

            // Si el cliente solicita más de lo disponible en stock, se frena todo el flujo transaccional
            if (stock.getProductQuantity() < detail.getAmountProducts()) {
                throw new RuntimeException("Insufficient stock for product ID: " 
                        + detail.getProduct().getIdProduct()
                        + ". Available: " + stock.getProductQuantity() 
                        + ", Requested: " + detail.getAmountProducts());
            }
        }
    }

    private void updateInventoryStock(List<SaleDetail> details) {
        for (SaleDetail detail : details) {
            // Recuperar el registro de stock actual
            Stock stock = stockRepository.findByProduct(detail.getProduct()).get();

            // Calcular y setear la nueva cantidad remanente
            int finalQuantity = stock.getProductQuantity() - detail.getAmountProducts();
            stock.setProductQuantity(finalQuantity);

            // Guardar la actualización en la tabla tbl_stocks de Neon
            stockRepository.save(stock);
        }
    }

    // --- MÉTODOS DE BÚSQUEDA Y SOPORTE ---

    @Override
    public List<Sale> getSalesByDateRange(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findByDateSaleBetween(start, end);
    }

    @Override
    public List<Sale> getSalesByPaymentMethod(Long paymentMethodId) {
        com.marcels.pos.models.entities.PaymentMethod pm = new com.marcels.pos.models.entities.PaymentMethod();
        pm.setIdPaymentMethod(paymentMethodId);
        return saleRepository.findByPaymentMethod(pm);
    }

    @Override
    public List<Sale> getSalesByMinimumAmount(BigDecimal minAmount) {
        return saleRepository.findByTotalAmountSaleGreaterThanEqual(minAmount);
    }

    @Override
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @Override
    public Sale getSaleById(Long id) {
        return saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + id));
    }

    @Override
    public Sale updateSale(Long id, Sale saleDetails) {
        Sale existingSale = getSaleById(id);
        existingSale.setDateSale(saleDetails.getDateSale());
        existingSale.setTotalAmountSale(saleDetails.getTotalAmountSale());
        existingSale.setPaymentMethod(saleDetails.getPaymentMethod());
        return saleRepository.save(existingSale);
    }

    @Override
    public void deleteSale(Long id) {
        Sale existingSale = getSaleById(id);
        saleRepository.delete(existingSale);
    }
}