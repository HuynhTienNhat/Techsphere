package com.example.BEsub.service;

import com.example.BEsub.dtos.CartItemDTO;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.Cart;
import com.example.BEsub.models.CartItem;
import com.example.BEsub.models.ProductVariant;
import com.example.BEsub.models.User;
import com.example.BEsub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class CartServiceImpl implements CartService{

    @Autowired
    CartRepository cartRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductVariantRepository productVariantRepository;


    @Override
    public List<CartItemDTO> getCart() {
        return getCartOfCurrentUser().getCartItems().stream().map(this::mapToCartItemDTO).toList();
    }

    @Override
    public void addItemToCart(CartItemDTO cartItemDTO) {
        ProductVariant variant = productVariantRepository.findById(cartItemDTO.getVariantId())
                .orElseThrow(() -> new AppException("Product variant not found"));

        if (cartItemDTO.getQuantity() > variant.getStockQuantity()) {
            throw new AppException("Not enough stock available");
        }

        Cart cart = getCartOfCurrentUser();

        cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemDTO.getItemId()))
                .findFirst()
                .ifPresentOrElse(
                        existingItem -> existingItem.setQuantity(existingItem.getQuantity() + cartItemDTO.getQuantity()),
                        () -> cart.getCartItems().add(mapToCartItem(cartItemDTO))
                );

        cartRepository.save(cart);
    }

    @Override
    public void deleteItemFromCart(Long itemId) {
        Cart cart = getCartOfCurrentUser();
        boolean removed = cart.getCartItems().removeIf(item -> item.getId().equals(itemId));
        if (!removed) {
            throw new AppException("Cart item not found");
        }
        cartRepository.save(cart);
    }

    @Override
    public void updateItemInCart(Long itemId, CartItemDTO cartItemDTO) {
        Cart cart = getCartOfCurrentUser();
        CartItem itemToUpdate = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new AppException("Cart item not found"));

        ProductVariant variant = itemToUpdate.getVariant();
        if (cartItemDTO.getQuantity() > variant.getStockQuantity()) {
            throw new AppException("Not enough stock available");
        }

        itemToUpdate.setQuantity(cartItemDTO.getQuantity());
        cartRepository.save(cart);
    }

    public CartItemDTO mapToCartItemDTO(CartItem cartItem){
        return CartItemDTO.builder()
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getUnitPrice())
                .cartId(cartItem.getId())
                .variantId(cartItem.getVariant().getId())
                .build();
    }


    public Cart getCartOfCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));
        return user.getCart();
    }

    public CartItem mapToCartItem(CartItemDTO cartItemDTO){
        CartItem cartItem = new CartItem();
        cartItem.setQuantity(cartItemDTO.getQuantity());
        cartItem.setUnitPrice(cartItemDTO.getUnitPrice());
        cartItem.setCart(getCartOfCurrentUser());

        ProductVariant productVariant = productVariantRepository.findById(cartItemDTO.getVariantId())
                .orElseThrow(()-> new AppException("Product variant not found"));
        cartItem.setVariant(productVariant);
        return cartItem;
    }

}
