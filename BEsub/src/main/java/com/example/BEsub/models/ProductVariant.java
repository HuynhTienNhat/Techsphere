package com.example.BEsub.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class ProductVariant extends BaseEntity{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String color;
    private String storage;

    @Column(name = "price_adjustment")
    private BigDecimal priceAdjustment;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;
}
