package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {
    private Long variantId;
    private String color;
    private String storage;
    private BigDecimal priceAdjustment;
    private Integer stockQuantity;
}