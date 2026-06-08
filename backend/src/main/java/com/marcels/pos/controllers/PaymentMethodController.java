package com.marcels.pos.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marcels.pos.models.entities.PaymentMethod;
import com.marcels.pos.services.PaymentMethodService;

@RestController
@RequestMapping("/api/payment-methods")

public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping
    public List<PaymentMethod> getAll() {
        return paymentMethodService.getAll();
    }

    // ELIMINA @PostMapping, @PutMapping y @DeleteMapping de aquí.
}