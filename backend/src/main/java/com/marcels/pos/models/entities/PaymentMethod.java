package com.marcels.pos.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "tbl_payment_methods")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class PaymentMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_payment_method")
    private Long idPaymentMethod;

    @Column(name = "name_payment_method", nullable = false, length = 50)
    private String namePaymentMethod;
}
