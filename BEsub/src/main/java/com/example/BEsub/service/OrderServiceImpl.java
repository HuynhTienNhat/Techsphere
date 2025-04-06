package com.example.BEsub.service;

import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.CartRepository;
import com.example.BEsub.repositories.OrderRepository;
import com.example.BEsub.repositories.UserAddressRepository;
import com.example.BEsub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService{

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserAddressRepository addressRepository;

    @Override
    public Order createOrderFromCart() {
//        Long userId = getUserIdOfCurrentUser();
//        Cart cart = cartRepository.findByUserId(userId)
//                .orElseThrow(()-> new AppException("User not found"));
//        if(cart.getCartItems().isEmpty()) throw new AppException("Cart is empty");
//
//        Order order = Order.builder()
//                .orderDate(LocalDateTime.now())
//                .orderItems(cart.getCartItems())
//                .address(addressRepository.findByUserId(userId))
//                .
        return null;
    }

    public OrderItem mapCartItemToOrderItem(CartItem cartItem, OrderItem orderItem, Order order){
        return OrderItem.builder()
                .order(order)
                .variant(cartItem.getVariant())
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getUnitPrice())
                .build();
    }

    public Long getUserIdOfCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));
        return user.getId();
    }
}
