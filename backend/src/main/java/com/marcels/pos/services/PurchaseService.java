package com.marcels.pos.services;

import com.marcels.pos.models.entities.Purchase;
import java.util.List;

public interface PurchaseService {
    // CRUD Base
    List<Purchase> getAllPurchases();
    Purchase getPurchaseById(Long id);
    Purchase savePurchase(Purchase purchase); // <-- Cerebro transaccional (Suma Stock)
    void deletePurchase(Long id);

    // Filtros personalizados útiles para reportes de gastos
    List<Purchase> getPurchasesByProvider(Long providerId);
}