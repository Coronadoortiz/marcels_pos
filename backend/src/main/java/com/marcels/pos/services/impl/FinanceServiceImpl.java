package com.marcels.pos.services.impl;

import java.util.List;

import org.springframework.stereotype.Service; 

import com.marcels.pos.models.dtos.FinanceReportDTO;
import com.marcels.pos.models.entities.Purchase;
import com.marcels.pos.models.entities.Sale;
import com.marcels.pos.models.repositories.PurchaseRepository;
import com.marcels.pos.models.repositories.SaleRepository;
import com.marcels.pos.services.FinanceService;

@Service
public class FinanceServiceImpl implements FinanceService {

    private final SaleRepository saleRepository;
    private final PurchaseRepository purchaseRepository;

    public FinanceServiceImpl(SaleRepository saleRepository, PurchaseRepository purchaseRepository) {
        this.saleRepository = saleRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @Override
    public FinanceReportDTO getGlobalFinancialReport() {
        List<Sale> sales = saleRepository.findAll();
        List<Purchase> purchases = purchaseRepository.findAll();

        // Cálculo de ingresos (Ventas)
        Double totalSales = sales.stream()
                .mapToDouble(s -> s.getSaleDetails().stream()
                        .mapToDouble(d -> d.getAmountProducts() * d.getProduct().getSellingValueProduct())
                        .sum())
                .sum();
        // Cálculo de egresos (Compras)
        Double totalPurchases = purchases.stream()
                .mapToDouble(p -> p.getPurchaseDetails().stream()
                        .mapToDouble(d -> d.getAmountPurchased() * d.getPurchaseProductPrice())
                        .sum())
                .sum();

        return new FinanceReportDTO(
                totalSales,
                totalPurchases,
                (totalSales - totalPurchases),
                (long) sales.size(),
                (long) purchases.size()
        );
    }
}