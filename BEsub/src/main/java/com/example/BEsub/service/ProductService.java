package com.example.BEsub.service;

import com.example.BEsub.dtos.ProductDetailDTO;
import com.example.BEsub.dtos.ProductDTO;

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
}
