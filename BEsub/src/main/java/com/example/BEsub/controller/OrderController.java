package com.example.BEsub.controller;

import com.example.BEsub.dtos.OrderCreateDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.enums.OrderStatus;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.repositories.UserRepository;
import com.example.BEsub.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    OrderService orderService;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    ResponseEntity<List<OrderDTO>> getAllOrdersOfUser() {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getAllOrdersOfUser());
    }

    @GetMapping("/{orderId}")
    ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrder(orderId));
    }

    @PostMapping
    ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreateDTO orderCreateDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createOrder(orderCreateDTO));
    }

    @GetMapping("/status")
    ResponseEntity<List<OrderDTO>> getOrdersByStatus(@RequestParam String status) {
        OrderStatus orderStatus = OrderStatus.fromString(status);
        Long userId = getCurrentUserId();
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrdersByStatus(userId, orderStatus));
    }

    @GetMapping("/month-year")
    ResponseEntity<List<OrderDTO>> getOrdersByMonthAndYear(@RequestParam int month, @RequestParam int year) {
        Long userId = getCurrentUserId();
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrdersByMonthAndYear(userId, month, year));
    }

    @PutMapping("/{orderId}/cancel")
    ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.status(HttpStatus.OK).body("Order cancelled successfully");
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"))
                .getId();
    }
}