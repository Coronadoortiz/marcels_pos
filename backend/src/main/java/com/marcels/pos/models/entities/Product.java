package com.marcels.pos.models.entities; // Revisa que sea tu paquete real

import jakarta.persistence.Column;
import jakarta.persistence.Entity; // Si usas Lombok para getters y setters
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Data;

@Entity
@Table(name = "tbl_products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Long idProduct;

    @Column(name = "name_product", nullable = false)
    private String nameProduct;

    @Column(name = "selling_value_product", nullable = false)
    private Double sellingValueProduct;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    // 🟢 EL CAMPO VOLÁTIL REQUERIDO POR NEXT.JS:
    // Al usar @Transient, Hibernate ignora por completo esta variable al generar los 
    // SQL automáticos, pero Jackson la serializa como un campo JSON limpio en la API.
    @Transient 
    private Integer stock = 0;
}