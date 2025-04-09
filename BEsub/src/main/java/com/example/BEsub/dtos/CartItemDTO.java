package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDTO {
    private Long cartItemId; // Để Customer có thể cập nhật/xóa mục cụ thể
    private Long productId; // ID sản phẩm chính
    private String productName; // Tên sản phẩm
    private String color; // Màu sắc từ ProductVariant
    private String storage; // Dung lượng từ ProductVariant
    private String imageUrl; // URL ảnh sản phẩm (lấy từ ProductImages nếu có)
    private Integer quantity; // Số lượng
    private BigDecimal unitPrice; // Giá đơn vị (base_price + price_adjustment)
    private BigDecimal itemTotal; // Tổng giá của mục này (unitPrice × quantity)
}
