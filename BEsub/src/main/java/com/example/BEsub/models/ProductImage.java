package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_images")
public class ProductImage extends BaseEntity{
    @Column(name = "img_url", nullable = false)
    private String imgUrl;

    @Column(name = "display_order")
    private Integer displayOrder;

    // Quan hệ Many-to-One với PRODUCTS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
}
