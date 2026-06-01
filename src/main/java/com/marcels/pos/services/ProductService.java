package com.marcels.pos.services;

import java.util.List;

import com.marcels.pos.models.entities.Product;

public interface ProductService {
    // CRUD Base
    List<Product> getAllProducts();
    Product getProductById(Long id);
    Product saveProduct(Product product); // <-- Creará el Producto y su Stock inicial
    Product updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);

    // Filtros mágicos basados en nombres que planeamos antes
    List<Product> getProductsByCategory(Long categoryId);
    Product getProductByName(String nameProduct);
}