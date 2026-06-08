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

@Entity                                      // Marks this class as a database model
@Table(name = "tbl_categories")              // Explicitly binds it to your database table
@Data                                        // Lombok automatically generates Getters, Setters, toString, equals, and hashCode
@NoArgsConstructor                           // Lombok generates a public parameterless constructor (Required by JPA)
@AllArgsConstructor                          // Lombok generates a constructor containing all parameters
public class Category {

    @Id                                      // Defines this attribute as the Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Instructs the DB to auto-increment this integer
    @Column(name = "id_category")            // Explicitly binds the field to your database column name
    private Long idCategory;

    @Column(name = "name_category", nullable = false, length = 50) // Adds database-level string validation rules
    private String nameCategory;
}