package com.marcels.pos.models.entities; // Revisa que sea tu paquete real

import jakarta.persistence.*;
import lombok.Data; // Si usas Lombok para getters y setters

@Entity
@Table(name = "tbl_products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Long idProduct;

    @Column(name = "sku")
    private String sku;

    @Column(name = "name_product")
    private String nameProduct;

    @Column(name = "selling_value_product")
    private Double sellingValueProduct;

    @Column(name = "purchase_price")
    private Double purchasePrice;

    @Column(name = "image")
    private String image;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    // 🟢 LA SOLUCIÓN: Atributo volátil para Next.js
    @Transient 
    private Integer stock = 0; // Inicializa por defecto en 0
}