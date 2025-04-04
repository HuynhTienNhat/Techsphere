package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_address")
@Data
public class UserAddress extends BaseEntity {
    private String city;

    private String street;

    @Column(name = "house_number")
    private String houseNumber;

    @Column(name = "is_default")
    private Boolean isDefault;

    // Quan hệ Many-to-One với USERS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
