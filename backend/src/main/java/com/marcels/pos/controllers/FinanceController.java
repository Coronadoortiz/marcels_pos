package com.marcels.pos.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping; // Importación corregida
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.marcels.pos.models.dtos.FinanceReportDTO;
import com.marcels.pos.services.FinanceService;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "http://localhost:3000")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/report")
    public ResponseEntity<?> getReport() {
        try {
            FinanceReportDTO report = financeService.getGlobalFinancialReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            // Esto imprimirá el error real en tu consola de Java
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error calculando finanzas: " + e.getMessage());
        }
    }
}