package com.marcels.pos.models.repositories;

import com.marcels.pos.models.entities.Provider;
import com.marcels.pos.models.entities.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Le indica a Spring Boot que este componente maneja el acceso a datos
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    // Método Mágico Derivado: Spring Boot lo lee y genera automáticamente:
    // SELECT * FROM tbl_purchases WHERE id_provider = ?
    List<Purchase> findByProvider(Provider provider);
}