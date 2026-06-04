package com.marcels.pos.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marcels.pos.models.entities.Sale;
import com.marcels.pos.services.SaleService;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public List<Sale> getAll() {
        return saleService.getAllSales();
    }

    @PostMapping
    @io.swagger.v3.oas.annotations.Operation(summary = "Registrar una venta y descontar stock automáticamente")
    public ResponseEntity<Sale> create(@RequestBody Sale sale) {
        // Al pasarle el JSON, Spring mapeará automáticamente la lista interna 'saleDetails'
        return new ResponseEntity<>(saleService.saveSale(sale), HttpStatus.CREATED);
    }
}