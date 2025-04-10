package com.example.BEsub.repositories;

import com.example.BEsub.models.Brand;
import com.example.BEsub.models.Product;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findBySlug(String slug);

    List<Product> findByBrand(Brand brand);

    @Query("SELECT p FROM Product p ORDER BY p.basePrice DESC")
    List<Product> findAllByOrderByBasePriceDesc();

    // Sắp xếp theo giá (thấp -> cao)
    @Query("SELECT p FROM Product p ORDER BY p.basePrice ASC")
    List<Product> findAllByOrderByBasePriceAsc();

    // Tìm kiếm theo tên hoặc model
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.model LIKE %:keyword%")
    List<Product> searchByNameOrModel(String keyword);
}
