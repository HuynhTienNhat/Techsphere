package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String color;
    private String storage;
    private BigDecimal priceAdjustment;
    private Integer stockQuantity;

    public BigDecimal getPrice() {
        return product.getPrice().add(priceAdjustment);
    }
}
