package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private String model;
    private String slug;
    private BigDecimal basePrice;
    private BigDecimal oldPrice;
    private String categoryName;
    private String brandName;
}

