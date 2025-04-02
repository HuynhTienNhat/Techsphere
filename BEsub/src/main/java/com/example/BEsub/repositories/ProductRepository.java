package com.example.BEsub.repositories;

import com.example.BEsub.models.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.*;
import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long> {
    @EntityGraph(attributePaths = {"variants", "images"})
    List<Product> findByBrand(String brand);

    // Search products by name or model
    @Query("SELECT p FROM Product p WHERE p.model LIKE %:query% OR p.brand LIKE %:query%")
    List<Product> searchProducts(@Param("query") String query);
}
