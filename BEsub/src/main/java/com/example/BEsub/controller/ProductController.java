package com.example.BEsub.controller;


import com.example.BEsub.dtos.*;
import com.example.BEsub.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Tạo sản phẩm
    @PostMapping
    public ResponseEntity<ProductDetailDTO> createProduct(@RequestBody @Valid ProductDetailDTO productDTO) {
        return ResponseEntity.ok(productService.createProduct(productDTO));
    }

    // Cập nhật sản phẩm
    @PutMapping("/{productId}")
    public ResponseEntity<ProductDetailDTO> updateProduct(@PathVariable Long productId,
                                                          @RequestBody @Valid ProductDetailDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(productId, productDTO));
    }

    // Xóa sản phẩm
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    // Lấy chi tiết sản phẩm theo slug
    @GetMapping("/{slug}")
    public ResponseEntity<ProductDetailDTO> getProductBySlug(@PathVariable String slug) {
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
    public ResponseEntity<List<ProductDTO>> getProductsSortedByPrice(@RequestParam(defaultValue = "asc") String order) {
        return ResponseEntity.ok(productService.getProductsSortedByPrice(order));
    }

    // Tìm kiếm sản phẩm
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
}