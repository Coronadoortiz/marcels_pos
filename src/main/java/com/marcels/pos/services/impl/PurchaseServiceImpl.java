package com.marcels.pos.services.impl;

import com.marcels.pos.models.entities.Provider;
import com.marcels.pos.models.entities.Purchase;
import com.marcels.pos.models.entities.PurchaseDetail;
import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.PurchaseRepository;
import com.marcels.pos.models.repositories.PurchaseDetailRepository;
import com.marcels.pos.models.repositories.StockRepository;
import com.marcels.pos.services.PurchaseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseDetailRepository purchaseDetailRepository;
    private final StockRepository stockRepository;

    // Inyección limpia por constructor
    public PurchaseServiceImpl(PurchaseRepository purchaseRepository, 
                               PurchaseDetailRepository purchaseDetailRepository, 
                               StockRepository stockRepository) {
        this.purchaseRepository = purchaseRepository;
        this.purchaseDetailRepository = purchaseDetailRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    @Transactional // Si un detalle falla al guardarse, se revierte la suma de inventario de todo el lote
    public Purchase savePurchase(Purchase purchase) {
        // Aseguramos que la fecha quede registrada al momento de la transacción
        if (purchase.getDatePurchase() == null) {
            purchase.setDatePurchase(LocalDateTime.now());
        }

        // Validación inicial básica de código limpio
        if (purchase.getPurchaseDetails() == null || purchase.getPurchaseDetails().isEmpty()) {
            throw new IllegalArgumentException("Cannot process a purchase order without items.");
        }

        // 1. Guardar la cabecera (tbl_purchases) para generar su ID autoincremental
        Purchase savedPurchase = purchaseRepository.save(purchase);

        // 2. Procesar los renglones (Sumar inventario y guardar detalles)
        processPurchaseDetailsAndStock(savedPurchase);

        return savedPurchase;
    }

    // --- MÉTODO PRIVADO ESPECIALIZADO (CLEAN CODE) ---
    private void processPurchaseDetailsAndStock(Purchase savedPurchase) {
        for (PurchaseDetail detail : savedPurchase.getPurchaseDetails()) {
            
            // 1. Buscar el registro de Stock del producto (Si no existe, se dispara el error seguro)
            Stock stock = stockRepository.findByProduct(detail.getProduct())
                    .orElseThrow(() -> new RuntimeException("Inventory record missing for product: " 
                            + detail.getProduct().getNameProduct()));

            // 2. Sumar la cantidad comprada al inventario actual
            int finalQuantity = stock.getProductQuantity() + detail.getAmountPurchased();
            stock.setProductQuantity(finalQuantity);
            stockRepository.save(stock); // Actualiza en Neon

            // 3. Enlazar este renglón de detalle con la compra padre que acabamos de guardar
            detail.setPurchase(savedPurchase);

            // 4. Guardar la línea de detalle físicamente en la BD (tbl_purchase_details)
            purchaseDetailRepository.save(detail);
        }
    }

    // --- MÉTODOS DE BÚSQUEDA Y SOPORTE ---

    @Override
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @Override
    public Purchase getPurchaseById(Long id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found with ID: " + id));
    }

    @Override
    public List<Purchase> getPurchasesByProvider(Long providerId) {
        // Objeto dummy de proveedor usando su ID para que la consulta derivada relacional funcione limpia
        Provider provider = new Provider();
        provider.setIdProvider(providerId); // Asegúrate de que el método setIdProvider exista en tu entidad Provider
        
        return purchaseRepository.findByProvider(provider);
    }

    @Override
    @Transactional
    public void deletePurchase(Long id) {
        Purchase existingPurchase = getPurchaseById(id);
        purchaseRepository.delete(existingPurchase);
    }
}