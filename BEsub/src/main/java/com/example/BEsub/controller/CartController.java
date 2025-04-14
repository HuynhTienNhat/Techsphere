package com.example.BEsub.controller;

import com.example.BEsub.dtos.*;
import com.example.BEsub.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {
    @Autowired
    private CartService cartService;

    // Lấy giỏ hàng của user hiện tại
    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        CartDTO cartDTO = cartService.getCartByUser();
        return ResponseEntity.ok(cartDTO);
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/items")
    public ResponseEntity<CartItemDTO> addToCart(@RequestBody CartItemRequest request) {
        CartItemDTO cartItemDTO = cartService.addToCart(request.getVariantId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED).body(cartItemDTO);
    }

    // Cập nhật số lượng sản phẩm trong giỏ
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemDTO> updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestBody QuantityUpdateRequest request) {
        CartItemDTO cartItemDTO = cartService.updateCartItemQuantity(cartItemId, request.getQuantity());
        return ResponseEntity.ok(cartItemDTO);
    }


    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.noContent().build();
    }
}