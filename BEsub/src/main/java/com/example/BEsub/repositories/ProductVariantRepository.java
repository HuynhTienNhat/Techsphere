package com.example.BEsub.repositories;

import com.example.BEsub.models.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    // Custom query methods can be defined here if needed
    // For example, find by product ID or color
    List<ProductVariant> findByProductId(Long productId);
    List<ProductVariant> findByColor(String color);
}
