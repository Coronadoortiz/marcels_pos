package com.marcels.pos.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_stock")
    private Long idStock;

    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(name = "product_quantity", nullable = false)
    private Integer productQuantity;

}
