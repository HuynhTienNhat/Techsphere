package com.example.BEsub.dtos.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String brand;
    private String model;
    private String slug;
    private BigDecimal basePrice;
    private String mainImageUrl;
    private List<String> galleryImages;  // Ordered by displayOrder
    private LocalDate releaseDate;
    private List<SpecResponse> specs;
    private List<VariantResponse> variants;
}
