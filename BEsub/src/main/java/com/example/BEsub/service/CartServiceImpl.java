package com.example.BEsub.service;

import com.example.BEsub.dtos.CartItemDTO;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.Cart;
import com.example.BEsub.models.CartItem;
import com.example.BEsub.models.User;
import com.example.BEsub.repositories.CartItemRepository;
import com.example.BEsub.repositories.CartRepository;
import com.example.BEsub.repositories.UserAddressRepository;
import com.example.BEsub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService{

    @Autowired
    CartRepository cartRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Override
    public List<CartItem> getCartByUserId() {
        Long userId = getUserIdOfCurrentUser();
        User user = userRepository.findById(userId).orElseThrow(()->new AppException("User not found"));
        return user.getCart().getCartItems();
    }

    @Override
    public void addItemToCart(CartItem cartItem) {
        Long userId = getUserIdOfCurrentUser();
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(()->new AppException("User not found"));
        List<CartItem> cartItems = cart.getCartItems();
        cartItems.add(cartItem);
        cart.setCartItems(cartItems);
        cartRepository.save(cart);
    }

    @Override
    public void deleteItemFromCart(Long itemId) {
        Long userId = getUserIdOfCurrentUser();
        Cart cart = cartRepository.findByUserId(userId).orElseThrow(()->new AppException("User not found"));
        List<CartItem> cartItems = cart.getCartItems();
        cartItems.removeIf(item -> item.getId().equals(itemId));
        cartRepository.save(cart);
    }

    @Override
    public void updateItemInCart(Long itemId, CartItemDTO cartItemDTO) {
        Long userId = getUserIdOfCurrentUser();
        CartItem item = cartItemRepository.findByIdAndCartUserId(itemId, userId)
                .orElseThrow(() -> new AppException("Cart item not found"));

    }

    public Long getUserIdOfCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));
        return user.getId();
    }

}
