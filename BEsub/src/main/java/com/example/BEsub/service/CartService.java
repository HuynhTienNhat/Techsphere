package com.example.BEsub.service;

import com.example.BEsub.dtos.*;

public interface CartService {
    CartDTO getCartByUser();
    CartItemDTO addToCart(Long variantId, Integer quantity);
    CartItemDTO updateCartItemQuantity(Long cartItemId, Integer quantity);
    void removeCartItem(Long cartItemId);
}
