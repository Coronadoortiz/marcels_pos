package com.marcels.pos.models.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marcels.pos.models.entities.Product;
import com.marcels.pos.models.entities.Stock;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProduct(Product product);
    // 🟢 Consulta nativa para sumar el stock actual acumulado del producto
    @Query(value = "SELECT COALESCE(SUM(amount_products), 0) FROM tbl_stocks WHERE id_product = :idProduct", nativeQuery = true)
    Integer getStockByProductId(@Param("idProduct") Long idProduct);
}