package com.marcels.pos.models.repositories;

import com.marcels.pos.models.entities.Product;
import com.marcels.pos.models.entities.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProduct(Product product);
}