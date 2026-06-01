package com.marcels.pos.models.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marcels.pos.models.entities.Category;
import com.marcels.pos.models.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Spring deduce automáticamente: SELECT * FROM tbl_products WHERE id_category = ?
    List<Product> findByCategory(Category category);

    // Spring deduce automáticamente: SELECT * FROM tbl_products WHERE name_product = ?
    Optional<Product> findByNameProduct(String nameProduct);
}