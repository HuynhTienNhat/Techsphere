package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long id;
    private Long variantId;
    private String productName; // Tên sản phẩm
    private String color;      // Màu sắc
    private String storage;    // Dung lượng
    private Integer quantity;  // Số lượng (mặc định 1, có thể tăng/giảm)
    private BigDecimal unitPrice; // Giá đơn vị
}
