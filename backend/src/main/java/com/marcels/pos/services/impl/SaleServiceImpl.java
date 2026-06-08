package com.marcels.pos.services.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marcels.pos.models.entities.PaymentMethod;
import com.marcels.pos.models.entities.Product;
import com.marcels.pos.models.entities.Sale;
import com.marcels.pos.models.entities.SaleDetail;
import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.PaymentMethodRepository;
import com.marcels.pos.models.repositories.ProductRepository;
import com.marcels.pos.models.repositories.SaleDetailRepository;
import com.marcels.pos.models.repositories.SaleRepository; // Asegúrate de tener este import
import com.marcels.pos.models.repositories.StockRepository;
import com.marcels.pos.services.SaleService; // Import para el repositorio de métodos de pago

@Service
public class SaleServiceImpl implements SaleService {

    private final SaleRepository saleRepository;
    private final SaleDetailRepository saleDetailRepository;
    private final StockRepository stockRepository;
    private final ProductRepository productRepository; // Inyectamos el repositorio de productos
    private final PaymentMethodRepository paymentMethodRepository; // Inyectamos el repositorio de métodos de pago

    public SaleServiceImpl(SaleRepository saleRepository, 
                           SaleDetailRepository saleDetailRepository, 
                           StockRepository stockRepository,
                           ProductRepository productRepository,
                           PaymentMethodRepository paymentMethodRepository) {
        this.saleRepository = saleRepository;
        this.saleDetailRepository = saleDetailRepository;
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

@Override
    @Transactional
    public Sale saveSale(Sale sale) {
        // 2. Validación de Método de Pago antes de procesar
        if (sale.getPaymentMethod() == null || sale.getPaymentMethod().getIdPaymentMethod() == null) {
            throw new IllegalArgumentException("Se requiere un método de pago válido.");
        }

        // Buscamos el método de pago persistido para asegurar la integridad
        PaymentMethod pm = paymentMethodRepository.findById(sale.getPaymentMethod().getIdPaymentMethod())
        .orElseThrow(() -> new RuntimeException("Método de pago no encontrado con ID: " 
                + sale.getPaymentMethod().getIdPaymentMethod()));
        sale.setPaymentMethod(pm);

        if (sale.getSaleDetails() == null || sale.getSaleDetails().isEmpty()) {
            throw new IllegalArgumentException("No se puede procesar una venta sin productos.");
        }

        if (sale.getDateSale() == null) {
            sale.setDateSale(LocalDateTime.now());
        }

        BigDecimal totalCalculadoVenta = BigDecimal.ZERO;

        for (SaleDetail detail : sale.getSaleDetails()) {
            detail.setSale(sale);
            Product productReal = productRepository.findById(detail.getProduct().getIdProduct())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado."));
            
            detail.setUnitProductPrice(productReal.getSellingValueProduct());
            detail.setProduct(productReal);
            
            BigDecimal precioBD = BigDecimal.valueOf(productReal.getSellingValueProduct());
            BigDecimal cantidad = BigDecimal.valueOf(detail.getAmountProducts());
            totalCalculadoVenta = totalCalculadoVenta.add(precioBD.multiply(cantidad));
        }

        sale.setTotalAmountSale(totalCalculadoVenta);

        validateStockAvailability(sale.getSaleDetails());
        updateInventoryStock(sale.getSaleDetails());

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
    public List<Sale> getSalesByPaymentMethod(Integer paymentMethodId) {
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