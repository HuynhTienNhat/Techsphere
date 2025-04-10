package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.*;

@Entity
@Table(name = "carts")
@Data
public class Cart extends BaseEntity {
    // Quan hệ One-to-One với USERS
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Quan hệ One-to-Many với CART_ITEMS
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();
}
