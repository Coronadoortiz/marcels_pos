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
@CrossOrigin(origins = "http://localhost:3000") 
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public List<Purchase> getAll() {
        return purchaseService.getAllPurchases();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseService.getPurchaseById(id));
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Registrar una orden de compra al proveedor y sumar stock automáticamente")
    public ResponseEntity<Purchase> create(@RequestBody Purchase purchase) {
        // Spring Boot deserializará el JSON mapeando internamente 'purchaseDetails' o 'purchaseDetail' (según corregiste)
        return new ResponseEntity<>(purchaseService.savePurchase(purchase), HttpStatus.CREATED);
    }

    @GetMapping("/provider/{providerId}")
    public List<Purchase> getByProvider(@PathVariable Long providerId) {
        return purchaseService.getPurchasesByProvider(providerId);
    }
}