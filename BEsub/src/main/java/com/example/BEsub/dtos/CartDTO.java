package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private Long cartId;
    private Long userId;
    private List<CartItemDTO> cartItems;
    private BigDecimal totalPrice;
}
