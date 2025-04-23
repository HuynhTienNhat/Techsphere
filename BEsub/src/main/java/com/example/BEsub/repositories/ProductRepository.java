package com.example.BEsub.repositories;

import com.example.BEsub.models.Brand;
import com.example.BEsub.models.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findBySlug(String slug);

    List<Product> findByBrand(Brand brand);

    @Query("SELECT p FROM Product p ORDER BY p.basePrice DESC")
    List<Product> findAllByOrderByBasePriceDesc();

    @Query("SELECT p FROM Product p ORDER BY p.basePrice ASC")
    List<Product> findAllByOrderByBasePriceAsc();

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.model LIKE %:keyword%")
    List<Product> searchByNameOrModel(String keyword);

    //Lọc theo brand và sắp xếp tăng dần
    @Query("SELECT p FROM Product p WHERE p.brand = :brand ORDER BY p.basePrice ASC")
    List<Product> findByBrandOrderByBasePriceAsc(Brand brand);

    // Lọc theo brand và sắp xếp giảm dần
    @Query("SELECT p FROM Product p WHERE p.brand = :brand ORDER BY p.basePrice DESC")
    List<Product> findByBrandOrderByBasePriceDesc(Brand brand);

    @Query("SELECT p FROM Product p ORDER BY p.sales DESC")
    List<Product> findAllByOrderBySalesDesc();

    @Query("SELECT p FROM Product p ORDER BY p.sales ASC")
    List<Product> findAllByOrderBySalesAsc();

    @Query("SELECT p FROM Product p ORDER BY p.sales DESC")
    List<Product> findTop6ByOrderBySalesDesc(Pageable pageable);
}

