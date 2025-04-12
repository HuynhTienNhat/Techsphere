package com.example.BEsub.controller;


import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.service.*;
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
    public ResponseEntity<ProductDetailDTO> createProduct(
            @RequestParam("name") String name,
            @RequestParam("model") String model,
            @RequestParam("slug") String slug,
            @RequestParam("basePrice") BigDecimal basePrice,
            @RequestParam(value = "oldPrice", required = false) BigDecimal oldPrice,
            @RequestParam("brandName") String brandName,
            @RequestParam(value = "variants", required = false) String variantsJson,
            @RequestParam(value = "specs", required = false) String specsJson,
            @RequestParam("imageFiles") List<MultipartFile> imageFiles,
            @RequestParam("displayOrders") List<Integer> displayOrders) throws Exception {

        // Kiểm tra dữ liệu đầu vào
        if (imageFiles == null || imageFiles.isEmpty()) {
            throw new AppException("At least one image is required");
        }
        if (imageFiles.size() != displayOrders.size()) {
            throw new AppException("Number of images and display orders must match");
        }

        // Tạo ProductCreateRequest từ các tham số
        ProductCreateRequest request = new ProductCreateRequest();
        request.setName(name);
        request.setModel(model);
        request.setSlug(slug);
        request.setBasePrice(basePrice);
        request.setOldPrice(oldPrice);
        request.setBrandName(brandName);
        request.setImageFiles(imageFiles);
        request.setDisplayOrders(displayOrders);

        // Chuyển JSON variants và specs thành List
        ObjectMapper objectMapper = new ObjectMapper();
        if (variantsJson != null && !variantsJson.isEmpty()) {
            List<ProductVariantDTO> variants = objectMapper.readValue(variantsJson, new TypeReference<List<ProductVariantDTO>>() {});
            request.setVariants(variants);
        }
        if (specsJson != null && !specsJson.isEmpty()) {
            List<ProductSpecDTO> specs = objectMapper.readValue(specsJson, new TypeReference<List<ProductSpecDTO>>() {});
            request.setSpecs(specs);
        }

        ProductDetailDTO productDTO = productService.createProduct(request);
        return ResponseEntity.ok(productDTO);
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

    @GetMapping("/reviews/{productId}")
    public ResponseEntity<List<ReviewDTO>> getProductReview(@PathVariable Long productId){
        return ResponseEntity.status(HttpStatus.OK).body(productService.getProductReview(productId));
    }

    @GetMapping("/reviews/{productId}/averageRating")
    public ResponseEntity<AverageRatingDTO> getAverageRating(@PathVariable Long productId){
        return ResponseEntity.status(HttpStatus.OK).body(productService.getAverageRating(productId));
    }
}