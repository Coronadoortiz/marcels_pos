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
@Table(name = "tbl_providers")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_provider")
    private Long idProvider;

    @Column(name = "nit_provider", nullable = false, length = 100)
    private String nitProvider;

    @Column(name = "name_provider", nullable = false, length = 100)
    private String nameProvider;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "email", nullable = false, length = 100)
    private String email;
}
