package com.marcels.pos.models.repositories;

import com.marcels.pos.models.entities.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

}
