package com.example.BEsub.controller;


import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @RequestParam("name") String name,
            @RequestParam("model") String model,
            @RequestParam("slug") String slug,
            @RequestParam("basePrice") BigDecimal basePrice,
            @RequestParam(value = "oldPrice", required = false) BigDecimal oldPrice,
            @RequestParam("brandName") String brandName,
            @RequestParam("variants") String variantsJson,
            @RequestParam("screen") String screen,
            @RequestParam("ram") String ram,
            @RequestParam("frontCamera") String frontCamera,
            @RequestParam("rearCamera") String rearCamera,
            @RequestParam("pin") String pin,
            @RequestParam("imageFiles") List<MultipartFile> imageFiles,
            @RequestParam("displayOrders") List<Integer> displayOrders) throws Exception {

        // Kiểm tra dữ liệu đầu vào
        if (imageFiles == null || imageFiles.isEmpty()) {
            throw new AppException("At least one image is required");
        }
        if (imageFiles.size() != displayOrders.size()) {
            throw new AppException("Number of images and display orders must match");
        }
        if (variantsJson == null || variantsJson.trim().isEmpty()) {
            throw new AppException("At least one variant is required");
        }

        // Tạo ProductCreateRequest
        ProductCreateRequest request = new ProductCreateRequest();
        request.setName(name);
        request.setModel(model);
        request.setSlug(slug);
        request.setBasePrice(basePrice);
        request.setOldPrice(oldPrice);
        request.setBrandName(brandName);
        request.setImageFiles(imageFiles);
        request.setDisplayOrders(displayOrders);

        // Gán specs
        request.setScreen(screen);
        request.setRam(ram);
        request.setFrontCamera(frontCamera);
        request.setRearCamera(rearCamera);
        request.setPin(pin);

        // Chuyển JSON variants
        ObjectMapper objectMapper = new ObjectMapper();
        List<ProductVariantDTO> variants;
        try {
            variants = objectMapper.readValue(variantsJson, new TypeReference<List<ProductVariantDTO>>() {});
        } catch (JsonProcessingException e) {
            throw new AppException("Invalid variants JSON format: " + e.getMessage());
        }
        if (variants.isEmpty()) {
            throw new AppException("At least one variant is required");
        }
        request.setVariants(variants);

        ProductDTO productDTO = productService.createProduct(request);
        return ResponseEntity.ok(productDTO);
    }

    // Cập nhật sản phẩm
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long productId,
            @RequestBody @Valid ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Xóa sản phẩm
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    // Lấy chi tiết sản phẩm theo slug
    @GetMapping("/{slug}")
    public ResponseEntity<ProductDTO> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    // Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Lọc theo hãng
    @GetMapping("/brand/{brandName}")
    public ResponseEntity<List<ProductDTO>> getProductsByBrand(@PathVariable String brandName) {
        return ResponseEntity.ok(productService.getProductsByBrand(brandName));
    }

    // Sắp xếp theo giá
    @GetMapping("/sort")
    public ResponseEntity<List<ProductDTO>> getProductsSortedByPrice(
            @RequestParam(defaultValue = "asc") String order) {
        return ResponseEntity.ok(productService.getProductsSortedByPrice(order));
    }

    // Tìm kiếm sản phẩm
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }   

    // Lọc theo hãng và sắp xếp theo giá
    @GetMapping("/by-brand")
    public ResponseEntity<List<ProductDTO>> getProductsByBrandAndSort(
            @RequestParam String brandName,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        return ResponseEntity.ok(productService.getProductsByBrandAndSort(brandName, sortOrder));
    }

    @GetMapping("/reviews/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReview(@PathVariable Long productId) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductReview(productId));
    }

    @GetMapping("/reviews/{productId}/averageRating")
    public ResponseEntity<AverageRatingDTO> getAverageRating(@PathVariable Long productId) {
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAverageRating(productId));
    }

    @GetMapping("/sort-by-sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductDTO>> getProductsSortedBySales(
            @RequestParam(defaultValue = "desc") String order) {
        return ResponseEntity.ok(productService.getProductsSortedBySales(order));
    }

    @GetMapping("/top-6-best-selling")
    public ResponseEntity<List<ProductDTO>> getTop6BestSellingProducts() {
        return ResponseEntity.ok(productService.getTop6BestSellingProducts());
    }
}