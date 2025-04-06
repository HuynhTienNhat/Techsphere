package com.example.BEsub.controller;

import com.example.BEsub.dtos.CartItemDTO;
import com.example.BEsub.models.Cart;
import com.example.BEsub.models.CartItem;
import com.example.BEsub.service.CartService;
import com.example.BEsub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/carts")
public class CartController {

    @Autowired
    CartService cartService;

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCartItems(){
        return ResponseEntity.status(HttpStatus.OK).body(cartService.getCart());
    }

    @PostMapping
    public ResponseEntity<String> addItemToCart(@RequestBody CartItemDTO cartItemDTO){
        cartService.addItemToCart(cartItemDTO);
        return ResponseEntity.status(HttpStatus.OK).body("Add item to cart successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItemFromCart(@PathVariable Long itemId){
        cartService.deleteItemFromCart(itemId);
        return ResponseEntity.status(HttpStatus.OK).body("Delete item to cart successfully");
    }

    @PutMapping("{id}")
    public ResponseEntity<String> updateItemInCart(@PathVariable Long itemId, @RequestBody CartItemDTO cartItemDTO){
        cartService.updateItemInCart(itemId,cartItemDTO);
        return ResponseEntity.status(HttpStatus.OK).body("Update item successfully");
    }


}
