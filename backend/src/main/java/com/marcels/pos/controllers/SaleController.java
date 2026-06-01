package com.marcels.pos.controllers;

import com.marcels.pos.models.entities.Sale;
import com.marcels.pos.services.SaleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
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