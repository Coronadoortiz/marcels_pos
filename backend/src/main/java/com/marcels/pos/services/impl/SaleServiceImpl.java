package com.marcels.pos.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marcels.pos.models.entities.Product;
import com.marcels.pos.models.entities.Sale;
import com.marcels.pos.models.entities.SaleDetail;
import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.ProductRepository;
import com.marcels.pos.models.repositories.SaleDetailRepository;
import com.marcels.pos.models.repositories.SaleRepository;
import com.marcels.pos.models.repositories.StockRepository; // Asegúrate de tener este import
import com.marcels.pos.services.SaleService;

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository saleDetailRepository;
    private final StockRepository stockRepository;
    private final ProductRepository productRepository; // Inyectamos el repositorio de productos

    public SaleServiceImpl(SaleRepository saleRepository, 
                           SaleDetailRepository saleDetailRepository, 
                           StockRepository stockRepository,
                           ProductRepository productRepository) {
        this.saleRepository = saleRepository;
        this.saleDetailRepository = saleDetailRepository;
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional // All-or-Nothing! Si algo falla, se revierte todo de Neon automáticamente
    public Sale saveSale(Sale sale) {
        // 1. Validar que la venta contenga productos
        if (sale.getSaleDetails() == null || sale.getSaleDetails().isEmpty()) {
            throw new IllegalArgumentException("Cannot process a sale without products.");
        }

        // 2. Asegurar que la fecha se registre al momento exacto de la transacción en el servidor
        if (sale.getDateSale() == null) {
            sale.setDateSale(LocalDateTime.now());
        }

        // 3. Enlazar detalles con el padre y ASIGNAR EL PRECIO REAL DEL CATÁLOGO
        BigDecimal totalCalculadoVenta = BigDecimal.ZERO;

        for (SaleDetail detail : sale.getSaleDetails()) {
            detail.setSale(sale);

            // EXTRAEMOS EL PRODUCTO REAL DE LA BASE DE DATOS PARA OBTENER SU PRECIO GUARDADO
            Product productReal = productRepository.findById(detail.getProduct().getIdProduct())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " 
                            + detail.getProduct().getIdProduct()));
            
            // Reemplazamos el precio del JSON por el precio real del catálogo (sellingValueProduct)
            detail.setUnitProductPrice(productReal.getSellingValueProduct());
            
            // Re-inyectamos el producto completo para que el flujo de stock no tenga problemas
            detail.setProduct(productReal);

            // (Opcional) Calculamos el subtotal de esta línea para acumularlo en el total general
            BigDecimal precioBD = BigDecimal.valueOf(productReal.getSellingValueProduct());
            BigDecimal cantidad = BigDecimal.valueOf(detail.getAmountProducts());
            totalCalculadoVenta = totalCalculadoVenta.add(precioBD.multiply(cantidad));
        }

        // 4. Forzar que el totalAmountSale de la cabecera sea el calculado matemáticamente por el servidor
        sale.setTotalAmountSale(totalCalculadoVenta);

        // 5. Validar disponibilidad de inventario para todos los productos solicitados
        validateStockAvailability(sale.getSaleDetails());

        // 6. Restar de forma segura las unidades de la tabla de Inventario (tbl_stocks)
        updateInventoryStock(sale.getSaleDetails());

        // 7. Guardar en cascada
        return saleRepository.save(sale);
    }

    // --- MÉTODOS PRIVADOS ESPECIALIZADOS (CLEAN CODE) ---

    private void validateStockAvailability(List<SaleDetail> details) {
        for (SaleDetail detail : details) {
            Stock stock = stockRepository.findByProduct(detail.getProduct())
                    .orElseThrow(() -> new RuntimeException("Inventory record missing for product ID: " 
                            + detail.getProduct().getIdProduct()));

            if (stock.getProductQuantity() < detail.getAmountProducts()) {
                throw new RuntimeException("Insufficient stock for product: " 
                        + detail.getProduct().getNameProduct()
                        + ". Available: " + stock.getProductQuantity() 
                        + ", Requested: " + detail.getAmountProducts());
            }
        }
    }

    private void updateInventoryStock(List<SaleDetail> details) {
        for (SaleDetail detail : details) {
            Stock stock = stockRepository.findByProduct(detail.getProduct()).get();
            int finalQuantity = stock.getProductQuantity() - detail.getAmountProducts();
            stock.setProductQuantity(finalQuantity);
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