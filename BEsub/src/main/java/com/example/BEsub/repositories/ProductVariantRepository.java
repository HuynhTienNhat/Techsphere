package com.example.BEsub.repositories;

import com.example.BEsub.models.ProductVariant;
import io.micrometer.common.lang.NonNullApi;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@NonNullApi
@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    Optional<ProductVariant> findById(Long id);
}
