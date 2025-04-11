package com.example.BEsub.service;

import com.example.BEsub.dtos.AverageRatingDTO;
import com.example.BEsub.dtos.ProductDetailDTO;
import com.example.BEsub.dtos.ProductDTO;
import com.example.BEsub.dtos.ReviewDTO;

import java.util.List;

public interface ProductService {
    ProductDetailDTO createProduct(ProductDetailDTO productDTO);
    ProductDetailDTO updateProduct(Long productId, ProductDetailDTO productDTO);
    void deleteProduct(Long productId);
    ProductDetailDTO getProductBySlug(String slug);
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getProductsByBrand(String brandName);
    List<ProductDTO> getProductsSortedByPrice(String sortOrder); // "asc" hoặc "desc"
    List<ProductDTO> searchProducts(String keyword);
    List<ReviewDTO> getProductReview(Long productId);
    AverageRatingDTO getAverageRating(Long productId);
}
