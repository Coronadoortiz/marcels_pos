package com.marcels.pos.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.marcels.pos.models.entities.Sale;

public interface SaleService {
    List<Sale> getAllSales();
    List<Sale> getSalesByDateRange(LocalDateTime start, LocalDateTime end);
    List<Sale> getSalesByPaymentMethod(Integer paymentMethodId);
    List<Sale> getSalesByMinimumAmount(BigDecimal minAmount);
    Sale getSaleById(Long id);
    Sale saveSale(Sale sale);
    Sale updateSale(Long id, Sale saleDetails);
    void deleteSale(Long id);
}
