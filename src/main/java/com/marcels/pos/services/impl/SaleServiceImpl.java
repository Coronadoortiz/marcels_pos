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

    // Inyectamos los 3 repositorios necesarios para procesar la transacción completa
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
    @Transactional // ¡All-or-Nothing! Si falta stock de un producto al final del bucle, todo se revierte
    public Sale saveSale(Sale sale) {
        // Aseguramos que la fecha se registre al momento exacto de la transacción
        if (sale.getDateSale() == null) {
            sale.setDateSale(LocalDateTime.now());
        }

        // 1. Validar stock de todos los productos antes de alterar nada en la BD
        validateStockAvailability(sale.getSaleDetails());

        // 2. Guardar la cabecera de la venta (tbl_sales) para generar su ID único
        Sale savedSale = saleRepository.save(sale);

        // 3. Procesar los detalles de la venta (restar stock y asociar ítems a la venta)
        processSaleDetailsAndStock(savedSale);

        return savedSale;
    }

    // --- MÉTODOS PRIVADOS ESPECIALIZADOS (CLEAN CODE) ---

    private void validateStockAvailability(List<SaleDetail> details) {
        if (details == null || details.isEmpty()) {
            throw new IllegalArgumentException("Cannot process a sale without products.");
        }

        for (SaleDetail detail : details) {
            // Buscamos el stock por el objeto Product usando las convenciones mágicas de Spring
            Stock stock = stockRepository.findByProduct(detail.getProduct())
                    .orElseThrow(() -> new RuntimeException("Inventory record missing for product: " 
                            + detail.getProduct().getNameProduct()));

            // Si el cliente pide más de lo que hay, disparamos la excepción que frena y revierte la transacción
            if (stock.getProductQuantity() < detail.getAmountProducts()) {
                throw new RuntimeException("Insufficient stock for product: " 
                        + detail.getProduct().getNameProduct() 
                        + ". Available: " + stock.getProductQuantity() 
                        + ", Requested: " + detail.getAmountProducts());
            }
        }
    }

    private void processSaleDetailsAndStock(Sale savedSale) {
        for (SaleDetail detail : savedSale.getSaleDetails()) {
            // 1. Recuperar el registro de stock (Ya sabemos que existe y alcanza por la validación previa)
            Stock stock = stockRepository.findByProduct(detail.getProduct()).get();

            // 2. Restar las unidades del inventario
            int finalQuantity = stock.getProductQuantity() - detail.getAmountProducts();
            stock.setProductQuantity(finalQuantity);
            stockRepository.save(stock); // Actualiza en Neon

            // 3. Enlazar este detalle a la venta padre que acabamos de guardar
            detail.setSale(savedSale);

            // 4. Guardar la línea de detalle en la base de datos (tbl_sale_details)
            saleDetailRepository.save(detail);
        }
    }

    // --- MÉTODOS DE BÚSQUEDA Y SOPORTE ---

    @Override
    public List<Sale> getSalesByDateRange(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findByDateSaleBetween(start, end);
    }

    @Override
    public List<Sale> getSalesByPaymentMethod(Long paymentMethodId) {
    // Creamos un objeto dummy de PaymentMethod con el ID para que el repositorio busque la relación
        com.marcels.pos.models.entities.PaymentMethod pm = new com.marcels.pos.models.entities.PaymentMethod();
        pm.setIdPaymentMethod(paymentMethodId); // Asegúrate de que este método set exista en tu entidad PaymentMethod
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