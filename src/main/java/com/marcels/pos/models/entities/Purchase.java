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
@Table(name = "tbl_purchases")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_purchase")
    private Long idPurchase;

    @Column(name = "date_purchase", nullable = false)
    private String datePurchase;

    @ManyToOne
    @JoinColumn(name = "id_provider", nullable = false)
    private Provider provider;
}
