package com.example.BEsub.dtos;

import com.example.BEsub.models.CartItem;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDTO {
    private List<CartItem> cartItems;
    private BigDecimal totalPrice;
}
