package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
public class Category extends BaseEntity {
    @Column(nullable = false)
    private String name;

    // Quan hệ One-to-Many với PRODUCTS
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;
}