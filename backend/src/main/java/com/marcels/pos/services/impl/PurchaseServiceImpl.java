package com.marcels.pos.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marcels.pos.models.entities.Provider;
import com.marcels.pos.models.entities.Purchase;
import com.marcels.pos.models.entities.PurchaseDetail;
import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.PurchaseDetailRepository;
import com.marcels.pos.models.repositories.PurchaseRepository;
import com.marcels.pos.models.repositories.StockRepository;
import com.marcels.pos.services.PurchaseService;

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
    @Transactional // All-or-Nothing: Si un paso falla, se deshacen todos los cambios en Neon de forma automática
    public Purchase savePurchase(Purchase purchase) {
        // 1. Validación inicial básica de código limpio
        if (purchase.getPurchaseDetails() == null || purchase.getPurchaseDetails().isEmpty()) {
            throw new IllegalArgumentException("Cannot process a purchase order without items.");
        }

        // 2. Aseguramos que la fecha quede registrada al momento exacto de la transacción en el servidor
        if (purchase.getDatePurchase() == null) {
            purchase.setDatePurchase(LocalDateTime.now());
        }

        // 3. ¡EL PASO CRÍTICO ANTIECEPCIONES!: Enlazar cada detalle con el objeto Compra Padre
        // Esto le indica a Hibernate la relación bidireccional antes de disparar el guardado en cascada
        for (PurchaseDetail detail : purchase.getPurchaseDetails()) {
            detail.setPurchase(purchase);
        }

        // 4. Actualizar el stock en la base de datos (Sumar las unidades ingresadas al inventario actual)
        updateInventoryStock(purchase.getPurchaseDetails());

        // 5. Guardar la estructura de forma segura (Inserta cabecera y detalles enlazados en un solo movimiento)
        return purchaseRepository.save(purchase);
    }

    // --- MÉTODO PRIVADO ESPECIALIZADO (CLEAN CODE) ---
    private void updateInventoryStock(List<PurchaseDetail> details) {
        for (PurchaseDetail detail : details) {
            
            // 1. Buscar el registro de Stock del producto en tbl_stocks
            Stock stock = stockRepository.findByProduct(detail.getProduct())
                    .orElseThrow(() -> new RuntimeException("Inventory record missing for product ID: " 
                            + detail.getProduct().getIdProduct()));

            // 2. Sumar la cantidad comprada al inventario remanente
            int finalQuantity = stock.getProductQuantity() + detail.getAmountPurchased();
            stock.setProductQuantity(finalQuantity);
            
            // 3. Persistir la actualización del stock inmediatamente en Neon
            stockRepository.save(stock); 
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
        provider.setIdProvider(providerId); 
        
        return purchaseRepository.findByProvider(provider);
    }

    @Override
    @Transactional
    public void deletePurchase(Long id) {
        Purchase existingPurchase = getPurchaseById(id);
        purchaseRepository.delete(existingPurchase);
    }
}