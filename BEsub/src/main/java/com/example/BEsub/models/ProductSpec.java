package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_specs")
public class ProductSpec extends BaseEntity{
    @Column(name = "spec_name", nullable = false)
    private String specName;

    @Column(name = "spec_value", nullable = false)
    private String specValue;

    // Quan hệ Many-to-One với PRODUCTS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
