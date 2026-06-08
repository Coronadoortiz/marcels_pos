package com.marcels.pos.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public PaymentMethod create(PaymentMethod paymentMethod) {
        return repository.save(paymentMethod);
    }

    @Override
    @Transactional
    public PaymentMethod update(Integer id, PaymentMethod paymentMethod) {
        PaymentMethod existing = getById(id);
        existing.setNamePaymentMethod(paymentMethod.getNamePaymentMethod());
        return repository.save(existing);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
    PaymentMethod method = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("No encontrado"));
    method.setActive(false); // Borrado lógico
    repository.save(method);
}

    @Override
    public PaymentMethod getById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Método de pago no encontrado"));
    }
}