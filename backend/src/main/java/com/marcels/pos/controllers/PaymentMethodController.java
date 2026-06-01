package com.marcels.pos.controllers;

import com.marcels.pos.models.entities.PaymentMethod;
import com.marcels.pos.models.repositories.PaymentMethodRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentMethodController(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @GetMapping
    public List<PaymentMethod> getAll() {
        return paymentMethodRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> create(@RequestBody PaymentMethod paymentMethod) {
        PaymentMethod savedMethod = paymentMethodRepository.save(paymentMethod);
        return new ResponseEntity<>(savedMethod, HttpStatus.CREATED);
    }
}