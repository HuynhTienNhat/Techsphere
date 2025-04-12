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
    private String screen; // Màn hình
    private String ram; // RAM
    private String frontCamera; // Camera trước
    private String rearCamera; // Camera sau
    private String pin; // CPU
    private List<MultipartFile> imageFiles;
    private List<Integer> displayOrders;
}
