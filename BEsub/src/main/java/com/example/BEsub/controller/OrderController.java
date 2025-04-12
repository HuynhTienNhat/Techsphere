package com.example.BEsub.controller;

import com.example.BEsub.dtos.OrderCreateDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    OrderService orderService;

    @GetMapping
    ResponseEntity<List<OrderDTO>> getAllOrdersOfUser(){
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getAllOrdersOfUser());
    }

    @GetMapping("/{orderId}")
    ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId){
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getOrder(orderId));
    }

    @PostMapping
    ResponseEntity<OrderDTO> createOrder(@RequestBody OrderCreateDTO orderCreateDTO){
        return ResponseEntity.status(HttpStatus.OK).body(orderService.createOrder(orderCreateDTO));
    }

    @DeleteMapping("/{orderId}")
    ResponseEntity<String> deleteOrder(@PathVariable Long orderId){
        orderService.deleteOrder(orderId);
        return ResponseEntity.status(HttpStatus.OK).body("Cancel order successfully");
    }
}
