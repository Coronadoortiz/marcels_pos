package com.marcels.pos.services;

import java.util.List;
import com.marcels.pos.models.entities.PaymentMethod;

public interface PaymentMethodService {
    List<PaymentMethod> getAll();
    PaymentMethod getById(Integer id);

}