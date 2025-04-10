package com.example.BEsub.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemRequest {
    private Long variantId;
    private Integer quantity;
}
