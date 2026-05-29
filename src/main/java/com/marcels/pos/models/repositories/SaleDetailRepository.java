package com.marcels.pos.models.repositories;

import com.marcels.pos.models.entities.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {

}
