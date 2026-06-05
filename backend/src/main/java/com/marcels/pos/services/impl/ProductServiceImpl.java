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

    public ProductServiceImpl(ProductRepository productRepository, StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        // 1. Obtener todos los productos de la base de datos
        List<Product> products = productRepository.findAll();

        // 2. 🟢 INYECCIÓN DE STOCK EN CALIENTE: 
        // Recorremos cada producto para buscar su cantidad real en tbl_stocks y asignársela
        for (Product product : products) {
            Optional<Stock> associatedStock = stockRepository.findByProduct(product);
            if (associatedStock.isPresent()) {
                // Sincroniza con el campo 'productQuantity' que definiste en tu entidad Stock.java
                product.setStock(associatedStock.get().getProductQuantity()); 
            } else {
                product.setStock(0); // Si por algún motivo no tiene registro, lo asegura en 0
            }
        }

        return products;
    }

    @Override
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        
        // 🟢 Asegurar que la consulta por ID individual también retorne su stock real calculado
        stockRepository.findByProduct(product)
                .ifPresent(stock -> product.setStock(stock.getProductQuantity()));

        return product;
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

        // Forzamos el valor en memoria para que la respuesta inmediata del POST devuelva stock: 0
        savedProduct.setStock(0);

        return savedProduct;
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = getProductById(id);

        // Sincronizado con los nombres exactos de tu entidad Product.java
        existingProduct.setNameProduct(productDetails.getNameProduct());
        existingProduct.setSellingValueProduct(productDetails.getSellingValueProduct());
        existingProduct.setCategory(productDetails.getCategory()); 
        existingProduct.setImage(productDetails.getImage()); // Aseguramos guardar la imagen en la edición

        Product updatedProduct = productRepository.save(existingProduct);
        
        // Mantener el stock calculado asignado al objeto que se va a retornar
        stockRepository.findByProduct(updatedProduct)
                .ifPresent(stock -> updatedProduct.setStock(stock.getProductQuantity()));

        return updatedProduct;
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
        category.setIdCategory(categoryId); 
        
        List<Product> products = productRepository.findByCategory(category);
        
        // Volvemos a inyectar el stock de forma segura si filtras por categoría
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