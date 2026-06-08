package com.marcels.pos.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marcels.pos.models.entities.PaymentMethod;
import com.marcels.pos.services.PaymentMethodService;

@RestController
@RequestMapping("/api/payment-methods")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    // Ahora inyectamos el servicio en lugar del repositorio
    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @GetMapping
    public List<PaymentMethod> getAll() {
        return paymentMethodService.getAll();
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> create(@RequestBody PaymentMethod paymentMethod) {
        return new ResponseEntity<>(paymentMethodService.create(paymentMethod), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentMethod> update(@PathVariable Integer id, @RequestBody PaymentMethod paymentMethod) {
        return ResponseEntity.ok(paymentMethodService.update(id, paymentMethod));
    }


}