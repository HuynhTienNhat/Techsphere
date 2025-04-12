package com.example.BEsub.service;

import com.example.BEsub.dtos.*;

import java.util.List;

public interface ProductService {
    ProductDetailDTO createProduct(ProductCreateRequest request);
    ProductDetailDTO updateProduct(Long productId, ProductDetailDTO productDTO);
    ProductDetailDTO getProductById(Long productId);
    void deleteProduct(Long productId);
    ProductDetailDTO getProductBySlug(String slug);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getProductsByBrand(String brandName);
    List<ProductDTO> getProductsSortedByPrice(String sortOrder); // "asc" hoặc "desc"
    List<ProductDTO> searchProducts(String keyword);
    List<ReviewDTO> getProductReview(Long productId);
    AverageRatingDTO getAverageRating(Long productId);
}
