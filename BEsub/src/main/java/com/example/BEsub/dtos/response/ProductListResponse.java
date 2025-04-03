package com.example.BEsub.dtos.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductListResponse {
    private Long id;
    private String brand;
    private String model;
    private String slug;
    private BigDecimal price;
    private String mainImageUrl;
    private List<String> availableColors;  // Derived from variants
}
