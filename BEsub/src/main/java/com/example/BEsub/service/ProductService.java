package com.example.BEsub.service;

import com.example.BEsub.dtos.mapper.ProductMapper;
import com.example.BEsub.dtos.request.ProductCreateRequest;
import com.example.BEsub.dtos.request.ProductUpdateRequest;
import com.example.BEsub.dtos.response.ProductResponse;
import com.example.BEsub.exception.ProductNotFoundException;
import com.example.BEsub.models.Product;
import com.example.BEsub.repositories.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)  // Optimize read operations
public class ProductService {
    private final ProductRepository productRepo;
    private final ProductMapper productMapper;

    // ---- Create ----
    @Transactional  // Override class-level readOnly for write operations
    public ProductResponse createProduct(ProductCreateRequest request) {
        Product product = productMapper.toEntity(request);
        return productMapper.toResponse(productRepo.save(product));
    }

    // ---- Read (Single) ----
    public ProductResponse getProductById(Long id) {
        return productRepo.findById(id)
                .map(productMapper::toResponse)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // ---- Read (All/Filtered) ----
    public List<ProductResponse> getAllProducts() {
        return productRepo.findAll().stream()
                .map(productMapper::toResponse)
                .toList();
    }

    public List<ProductResponse> getFilteredProducts(
            String brand,
            String search,
            String sort,
            Double minPrice,
            Double maxPrice
    ) {
        List<Product> products = productRepo.findAll();  // Small dataset → acceptable

        return products.stream()
                .filter(p -> brand == null || p.getBrand().equalsIgnoreCase(brand))
                .filter(p -> search == null ||
                        containsIgnoreCase(p.getBrand(), search) ||
                        containsIgnoreCase(p.getModel(), search))
                .filter(p -> minPrice == null || p.getPrice().compareTo(BigDecimal.valueOf(minPrice)) >= 0)
                .filter(p -> maxPrice == null || p.getPrice().compareTo(BigDecimal.valueOf(maxPrice)) <= 0)
                .sorted(getSortComparator(sort))
                .map(productMapper::toResponse)
                .toList();
    }

    // ---- Update ----
    @Transactional
    public ProductResponse updateProduct(Long id, @Valid ProductUpdateRequest request) {
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        productMapper.updateFromRequest(request, product);
        return productMapper.toResponse(productRepo.save(product));
    }

    // ---- Delete ----
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepo.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepo.deleteById(id);
    }

    // ---- Helpers ----
    private Comparator<Product> getSortComparator(String sort) {
        return switch (Optional.ofNullable(sort).orElse("")) {
            case "price_asc" -> Comparator.comparing(Product::getPrice);
            case "price_desc" -> Comparator.comparing(Product::getPrice).reversed();
            default -> Comparator.comparing(Product::getId);
        };
    }

    private boolean containsIgnoreCase(String source, String search) {
        return source.toLowerCase().contains(search.toLowerCase());
    }
}