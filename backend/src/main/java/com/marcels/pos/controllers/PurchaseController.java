package com.marcels.pos.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marcels.pos.models.entities.Purchase;
import com.marcels.pos.services.PurchaseService;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "http://localhost:3000") // 🟢 Desbloquea la comunicación fluida con Next.js
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    // 1. Listar el historial completo de compras (Sincronizado con tu Tab de Next.js)
    @GetMapping
    public List<Purchase> getAll() {
        return purchaseService.getAllPurchases();
    }

    // 2. Obtener una compra específica por ID
    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseService.getPurchaseById(id));
    }

    // 3. 🟢 REGISTRAR COMPRA (POST) - Recibe la orden del frontend e incrementa stock en Neon
    @PostMapping
    public ResponseEntity<Purchase> create(@RequestBody Purchase purchase) {
        // El servicio procesará el guardado de la cabecera y el detalle en una sola transacción
        Purchase savedPurchase = purchaseService.savePurchase(purchase);
        return new ResponseEntity<>(savedPurchase, HttpStatus.CREATED);
    }

    // 4. Listar el historial de compras filtrado por un Proveedor específico
    @GetMapping("/provider/{providerId}")
    public List<Purchase> getByProvider(@PathVariable Long providerId) {
        return purchaseService.getPurchasesByProvider(providerId);
    }
}