package com.marcels.pos.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import com.marcels.pos.models.entities.PaymentMethod;
import com.marcels.pos.models.repositories.PaymentMethodRepository;
import com.marcels.pos.services.PaymentMethodService;

@Service
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository repository;

    public PaymentMethodServiceImpl(PaymentMethodRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<PaymentMethod> getAll() {
        return repository.findAll();
    }

    @Override
    public PaymentMethod getById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
    }

}