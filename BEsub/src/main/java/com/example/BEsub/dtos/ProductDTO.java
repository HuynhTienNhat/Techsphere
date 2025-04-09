package com.example.BEsub.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;

    @NotBlank(message = "Product name cannot be blank")
    @Size(max = 100, message = "Product name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Model is required")
    @Size(max = 50, message = "Model cannot exceed 50 characters")
    private String model;

    @NotBlank(message = "Slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug can only contain lowercase letters, numbers, and hyphens")
    private String slug;

    @NotNull(message = "Base price cannot be null")
    @DecimalMin(value = "500000", message = "Base price must be at least 500,000")
    @DecimalMax(value = "50000000", message = "Base price must be less than 50,000,000")
    private BigDecimal basePrice;

    @DecimalMin(value = "500000", message = "Old price must be at least 500,000")
    @DecimalMax(value = "50000000", message = "Old price must be less than 50,000,000")
    private BigDecimal oldPrice;

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name cannot exceed 50 characters")
    private String categoryName;

    @NotBlank(message = "Brand name is required")
    @Size(max = 50, message = "Brand name cannot exceed 50 characters")
    private String brandName;
}
