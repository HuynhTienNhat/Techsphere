package com.example.BEsub.dtos.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class VariantRequest {
    @NotBlank
    private String color;

    @NotBlank
    private String storage;

    @DecimalMin("0.0")
    private BigDecimal priceAdjustment;

    @Min(0)
    private Integer stockQuantity;
}
