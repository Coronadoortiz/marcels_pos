package com.marcels.pos.models.repositories;

import com.marcels.pos.models.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Spring Data JPA ya te da el .findAll() y .save() automáticamente
}