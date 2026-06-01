package com.marcels.pos.models.repositories;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marcels.pos.models.entities.PaymentMethod;
import com.marcels.pos.models.entities.Sale;

@Repository 
public interface SaleRepository extends JpaRepository<Sale, Long> {
List<Sale> findByDateSaleBetween(LocalDateTime start, LocalDateTime end);
List<Sale> findByPaymentMethod(PaymentMethod paymentMethod);
List<Sale> findByTotalAmountSaleGreaterThanEqual(BigDecimal amount);
}
