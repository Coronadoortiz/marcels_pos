package com.marcels.pos.services;

import java.util.List;

import com.marcels.pos.models.entities.PaymentMethod;

public interface PaymentMethodService {
    List<PaymentMethod> getAll();
    PaymentMethod create(PaymentMethod paymentMethod);
    PaymentMethod update(Long id, PaymentMethod paymentMethod);
    void delete(Long id);
    PaymentMethod getById(Long id);
}