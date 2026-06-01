package com.marcels.pos.services.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marcels.pos.models.entities.Category;
import com.marcels.pos.models.entities.Product;
import com.marcels.pos.models.entities.Stock;
import com.marcels.pos.models.repositories.ProductRepository;
import com.marcels.pos.models.repositories.StockRepository;
import com.marcels.pos.services.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public ProductServiceImpl(ProductRepository productRepository, StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    @Override
    @Transactional // Si falla la creación del inventario, no se guarda el producto
    public Product saveProduct(Product product) {
        // 1. Guardar primero el producto para generar su idProduct
        Product savedProduct = productRepository.save(product);

        // 2. Inicializar de forma automática su registro en tbl_stocks con 0 unidades
        Stock initialStock = new Stock();
        initialStock.setProduct(savedProduct);
        initialStock.setProductQuantity(0);

        stockRepository.save(initialStock);

        return savedProduct;
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = getProductById(id);

        // Sincronizado con los nombres exactos de tu entidad Product.java
        existingProduct.setNameProduct(productDetails.getNameProduct());
        existingProduct.setSellingValueProduct(productDetails.getSellingValueProduct()); // <-- Corregido aquí
        existingProduct.setCategory(productDetails.getCategory()); 

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product existingProduct = getProductById(id);
        
        // Eliminamos el stock asociado para evitar problemas de llaves foráneas
        stockRepository.findByProduct(existingProduct)
                .ifPresent(stock -> stockRepository.delete(stock));

        productRepository.delete(existingProduct);
    }

    // --- MÉTODOS DE BÚSQUEDA PERSONALIZADOS ---

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = new Category();
        category.setIdCategory(categoryId); // Asegúrate de tener setIdCategory en tu entidad Category
        
        return productRepository.findByCategory(category); // <-- Llamada al repositorio corregida
    }

    @Override
    public Product getProductByName(String nameProduct) {
        return productRepository.findByNameProduct(nameProduct)
                .orElseThrow(() -> new RuntimeException("Product not found with name: " + nameProduct));
    }
}