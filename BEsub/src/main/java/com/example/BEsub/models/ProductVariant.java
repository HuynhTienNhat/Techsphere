package com.example.BEsub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_variants")
@Data
public class ProductVariant extends BaseEntity {
    private String color;

    private String storage;

    @Column(name = "price_adjustment")
    private BigDecimal priceAdjustment;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    // Quan hệ Many-to-One với PRODUCTS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}