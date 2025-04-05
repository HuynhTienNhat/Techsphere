package com.example.BEsub.service;

import com.example.BEsub.dtos.CartItemDTO;
import com.example.BEsub.models.Cart;
import com.example.BEsub.models.CartItem;

import java.util.List;


public interface CartService {
    public List<CartItem> getCartByUserId();
    public void addItemToCart(CartItem cartItem);
    public void deleteItemFromCart(Long itemId);
    public void updateItemInCart(Long itemId, CartItemDTO cartItemDTO);
}
