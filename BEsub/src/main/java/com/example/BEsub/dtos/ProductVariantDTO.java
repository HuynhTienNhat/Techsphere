package com.example.BEsub.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {
    private Long variantId;

    @NotBlank(message = "Color cannot be blank")
    @Size(max = 50, message = "Color cannot exceed 50 characters")
    private String color;

    @NotBlank(message = "Storage cannot be blank")
    @Size(max = 50, message = "Storage cannot exceed 50 characters")
    private String storage;

    @NotNull(message = "Price adjustment cannot be null")
    @DecimalMin(value = "-10000000.000", message = "Price adjustment must be at least -10.000.000")
    @DecimalMax(value = "10000000.000", message = "Price adjustment must be less than 10.000.000")
    private BigDecimal priceAdjustment;

    @NotNull(message = "Stock quantity cannot be null")
    @Min(value = 0, message = "Stock quantity must be at least 0")
    private Integer stockQuantity;
}