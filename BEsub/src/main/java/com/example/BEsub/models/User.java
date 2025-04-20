package com.example.BEsub.models;


import com.example.BEsub.enums.*;
import jakarta.persistence.*;
import lombok.Data;

import java.time.*;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class User extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String email;

    private String name;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    private String phone;

    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    // Quan hệ One-to-Many với USER_ADDRESS
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserAddress> addresses;

    // Quan hệ One-to-Many với ORDERS
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    // Quan hệ One-to-One với CART
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
}