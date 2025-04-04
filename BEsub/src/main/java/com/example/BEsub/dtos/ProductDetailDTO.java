package com.example.BEsub.dtos;

import java.math.BigDecimal;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailDTO {
    private Long productId;
    private String name;
    private String model;
    private String slug;
    private BigDecimal basePrice;
    private BigDecimal oldPrice;
    private String categoryName;
    private String brandName;
    private List<ProductVariantDTO> variants;
    private List<ProductSpecDTO> specs;
    private List<ProductImageDTO> images;
    private List<ReviewDTO> reviews;
}


