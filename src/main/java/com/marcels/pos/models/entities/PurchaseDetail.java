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
@Table(name = "tbl_purchases_details")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_purchase_detail")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_purchase", nullable = false)
    private Purchase purchase;

    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    private Product product;

    @Column(name = "amount_purchased")
    private Integer amountPurchased;

    @Column(name = "purchase_product_price")
    private Double purchaseProductPrice;

}
