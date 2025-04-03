package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product extends BaseEntity{
    private String brand;
    private String model;
    private String slug;
    private BigDecimal price;

    @Column(name = "old_price")
    private BigDecimal oldPrice;

    @Column(name = "main_img_url", columnDefinition = "TEXT")
    private String mainImgUrl;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductSpec> specs;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants;
}
