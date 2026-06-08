package com.marcels.pos.services;

import java.util.List;

import com.marcels.pos.models.entities.PaymentMethod;

public interface PaymentMethodService {
    List<PaymentMethod> getAll();
    PaymentMethod create(PaymentMethod paymentMethod);
    PaymentMethod update(Integer id, PaymentMethod paymentMethod);
    void delete(Integer id);
    PaymentMethod getById(Integer id);
}