package com.example.BEsub.models;

import com.example.BEsub.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
@Data
public class Product extends BaseEntity {
    @Column(nullable = false)
    private String name;

    private String model;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Column(name = "old_price")
    private BigDecimal oldPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    // Quan hệ One-to-Many với PRODUCT_VARIANTS
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

    // Quan hệ One-to-Many với PRODUCT_IMAGES
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    // Quan hệ One-to-Many với PRODUCT_SPECS
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductSpec> specs;

    @Column(name = "sales", nullable = false)
    private Integer sales = 0;
}
