package com.example.BEsub.service;

import com.example.BEsub.dtos.*;

import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductCreateRequest request);
    ProductDTO updateProduct(Long productId, ProductDTO productDTO);
    ProductDTO getProductById(Long productId);
    void deleteProduct(Long productId);
    ProductDTO getProductBySlug(String slug);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getProductsByBrand(String brandName);
    List<ProductDTO> getProductsSortedByPrice(String sortOrder); // "asc" hoặc "desc"
    List<ProductDTO> getProductsByBrandAndSort(String brandName, String sortOrder);
    List<ProductDTO> searchProducts(String keyword);
    List<ReviewDTO> getProductReview(Long productId);
    AverageRatingDTO getAverageRating(Long productId);
}

