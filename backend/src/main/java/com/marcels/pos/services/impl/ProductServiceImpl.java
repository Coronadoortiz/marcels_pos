package com.marcels.pos.services.impl;

import java.util.List;
import java.util.Optional;

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

    // Constructor Injection limpio
    public ProductServiceImpl(ProductRepository productRepository, StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        // 1. Obtener todos los productos limpios desde tbl_products en Neon
        List<Product> products = productRepository.findAll();

        // 2. 🟢 INYECCIÓN DE STOCK EN CALIENTE:
        // Recorremos cada producto para leer su cantidad física en tbl_stocks y asignársela al campo @Transient
        for (Product product : products) {
            Optional<Stock> associatedStock = stockRepository.findByProduct(product);
            if (associatedStock.isPresent()) {
                product.setStock(associatedStock.get().getProductQuantity()); 
            } else {
                product.setStock(0); // Fail-safe: si no tiene registro de stock, asegura un 0
            }
        }

        return products;
    }

    @Override
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        
        // Sincronizar el stock calculado para la consulta por ID individual
        stockRepository.findByProduct(product)
                .ifPresent(stock -> product.setStock(stock.getProductQuantity()));

        return product;
    }

    @Override
    @Transactional // Transaccionalidad ACID: Si la creación del stock falla, se hace rollback del producto
    public Product saveProduct(Product product) {
        // 1. Guardar primero el producto para generar su id_product autoincremental en Neon
        Product savedProduct = productRepository.save(product);

        // 2. Inicializar de forma automática su registro en la tabla de inventarios (tbl_stocks) con 0 unidades
        Stock initialStock = new Stock();
        initialStock.setProduct(savedProduct);
        initialStock.setProductQuantity(0);

        stockRepository.save(initialStock);

        // Forzamos el valor en memoria para que la respuesta inmediata de la API devuelva stock: 0 a Next.js
        savedProduct.setStock(0);

        return savedProduct;
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        // 1. Buscamos el producto existente
        Product existingProduct = getProductById(id);

        // 2. Modificamos los campos permitidos (🟢 RECTIFICADO: Se removió existingProduct.setImage)
        existingProduct.setNameProduct(productDetails.getNameProduct());
        existingProduct.setSellingValueProduct(productDetails.getSellingValueProduct());

        // 3. ASOCIACIÓN SEGURA DE CATEGORÍA:
        if (productDetails.getCategory() != null && productDetails.getCategory().getIdCategory() != null) {
            Category categoryRef = new Category();
            categoryRef.setIdCategory(productDetails.getCategory().getIdCategory());
            existingProduct.setCategory(categoryRef);
        }

        // 4. Guardamos los cambios en Neon
        Product updatedProduct = productRepository.save(existingProduct);
        
        // 5. Mantenemos el stock actual asignado para retornar la respuesta correcta a Next.js
        stockRepository.findByProduct(updatedProduct)
                .ifPresent(stock -> updatedProduct.setStock(stock.getProductQuantity()));

        return updatedProduct;
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product existingProduct = getProductById(id);
        
        // 1. Eliminamos primero el registro de stock asociado para evitar violaciones de llaves foráneas en Neon
        stockRepository.findByProduct(existingProduct)
                .ifPresent(stock -> stockRepository.delete(stock));

        // 2. Eliminamos el producto
        productRepository.delete(existingProduct);
    }

    // --- MÉTODOS DE BÚSQUEDA PERSONALIZADOS ---

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = new Category();
        category.setIdCategory(categoryId); 
        
        List<Product> products = productRepository.findByCategory(category);
        
        for (Product product : products) {
            stockRepository.findByProduct(product)
                    .ifPresent(stock -> product.setStock(stock.getProductQuantity()));
        }
        
        return products;
    }

    @Override
    public Product getProductByName(String nameProduct) {
        Product product = productRepository.findByNameProduct(nameProduct)
                .orElseThrow(() -> new RuntimeException("Product not found with name: " + nameProduct));
        
        stockRepository.findByProduct(product)
                .ifPresent(stock -> product.setStock(stock.getProductQuantity()));
                
        return product;
    }
}