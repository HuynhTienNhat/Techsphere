package com.example.BEsub.dtos.response;

import java.math.BigDecimal;

public class VariantResponse {
    private Long id;
    private String color;
    private String storage;
    private BigDecimal currentPrice;  // basePrice + adjustment
    private boolean inStock;
}
