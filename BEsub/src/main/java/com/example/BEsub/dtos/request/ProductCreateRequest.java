package com.example.BEsub.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProductCreateRequest {
    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @FutureOrPresent(message = "Release date cannot be in the past")
    private LocalDate releaseDate;

    @NotEmpty(message = "At least one image is required")
    private List<@URL String> imageUrls;  // First image = main image

    private List<SpecRequest> specs;      // Optional
    private List<VariantRequest> variants; // Optional
}
