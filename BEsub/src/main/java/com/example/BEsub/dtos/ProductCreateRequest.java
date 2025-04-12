package com.example.BEsub.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateRequest {
    private String name;
    private String model;
    private String slug;
    private BigDecimal basePrice;
    private BigDecimal oldPrice;
    private String brandName;
    private List<ProductVariantDTO> variants;
    private List<ProductSpecDTO> specs;
    private List<MultipartFile> imageFiles; // Nhận file hình ảnh
    private List<Integer> displayOrders; // Thứ tự hiển thị của hình ảnh
 }
