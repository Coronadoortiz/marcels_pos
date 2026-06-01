package com.marcels.pos.models.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;  
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sale")
    private Long idSale;

    @Column(name = "date_sale", nullable = false)
    private LocalDateTime dateSale; // <-- Cambio a LocalDateTime (Para que la BD maneje fechas reales, no texto)

    @Column(name = "total_amount_sale", nullable = false)
    private BigDecimal totalAmountSale; // <-- Cambio a BigDecimal (Evita errores de redondeo de centavos del tipo Double)

    @ManyToOne
    @JoinColumn(name = "id_payment_method", nullable = false)
    private PaymentMethod paymentMethod;
    
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SaleDetail> saleDetails;
}