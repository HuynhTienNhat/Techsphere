package com.example.BEsub.dtos;

import jakarta.validation.constraints.*;

public class CartItemRequestDTO { // DTO for adding items
    @NotNull(message = "Variant ID is required")
    private Long variantId;
}
