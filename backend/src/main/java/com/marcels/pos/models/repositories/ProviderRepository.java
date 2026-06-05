package com.marcels.pos.models.repositories;

import com.marcels.pos.models.entities.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface ProviderRepository extends JpaRepository<Provider, Long> {

}
