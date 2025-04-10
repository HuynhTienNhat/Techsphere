package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "brands")
@Data
public class Brand extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @Column(name = "logo_url")
    private String logoUrl;

    // Quan hệ One-to-Many với PRODUCTS
    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL)
    private List<Product> products;
}