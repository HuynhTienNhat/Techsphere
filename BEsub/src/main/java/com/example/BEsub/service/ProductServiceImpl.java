package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Transactional
    @Override
    public ProductDetailDTO createProduct(ProductDetailDTO productDTO) {
        Product product = new Product();

        if (productRepository.findBySlug(productDTO.getSlug()) != null) {
            throw new AppException("Slug already exists");
        }

        mapToEntity(productDTO, product);
        Product savedProduct = productRepository.save(product);
        return mapToDetailDTO(savedProduct);
    }

    @Transactional
    @Override
    public ProductDetailDTO updateProduct(Long productId, ProductDetailDTO productDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));

        Product existingProduct = productRepository.findBySlug(productDTO.getSlug());
        if (existingProduct != null && !existingProduct.getId().equals(productId)) {
            throw new AppException("Slug already exists");
        }

        mapToEntity(productDTO, product);
        Product updatedProduct = productRepository.save(product);
        return mapToDetailDTO(updatedProduct);
    }

    @Transactional
    @Override
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new AppException("Product not found");
        }
        productRepository.deleteById(productId);
    }

    @Override
    public ProductDetailDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug);
        if (product == null) throw new AppException("Product not found");
        return mapToDetailDTO(product);
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByBrand(String brandName) {
        Brand brand = brandRepository.findByName(brandName)
                .orElseThrow(() -> new AppException("Brand not found"));
        return productRepository.findByBrand(brand).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsSortedByPrice(String sortOrder) {
        if ("desc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllByOrderByBasePriceDesc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else if ("asc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllByOrderByBasePriceAsc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new AppException("Invalid sort order. Use 'asc' or 'desc'");
        }
    }

    @Override
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchByNameOrModel(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Ánh xạ từ DTO sang Entity
    private void mapToEntity(ProductDetailDTO dto, Product product) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new AppException("Product name cannot be null or blank");
        }

        product.setName(dto.getName());
        product.setModel(dto.getModel());
        product.setSlug(dto.getSlug());
        product.setBasePrice(dto.getBasePrice());
        product.setOldPrice(dto.getOldPrice());

        // Ánh xạ Brand
        String brandName = dto.getBrandName();
        if (brandName == null || brandName.isBlank()) {
            throw new AppException("Brand name cannot be null or blank");
        }
        Brand brand = brandRepository.findByName(brandName)
                .orElseGet(() -> {
                    Brand newBrand = new Brand();
                    newBrand.setName(brandName);
                    return brandRepository.save(newBrand);
                });

        product.setBrand(brand);

        // Ánh xạ Variants
        if (dto.getVariants() != null) {
            List<ProductVariant> variants = dto.getVariants().stream()
                    .map(v -> {
                        ProductVariant variant = new ProductVariant();
                        variant.setColor(v.getColor());
                        variant.setStorage(v.getStorage());
                        variant.setPriceAdjustment(v.getPriceAdjustment());
                        variant.setStockQuantity(v.getStockQuantity());
                        variant.setProduct(product);
                        return variant;
                    })
                    .collect(Collectors.toList());
            product.setVariants(variants);
        }

        // Ánh xạ Specs
        if (dto.getSpecs() != null) {
            List<ProductSpec> specs = dto.getSpecs().stream()
                    .map(s -> {
                        ProductSpec spec = new ProductSpec();
                        spec.setSpecName(s.getSpecName());
                        spec.setSpecValue(s.getSpecValue());
                        spec.setProduct(product);
                        return spec;
                    })
                    .collect(Collectors.toList());
            product.setSpecs(specs);
        }

        // Ánh xạ Images
        if (dto.getImages() != null) {
            List<ProductImage> images = dto.getImages().stream()
                    .filter(i -> i.getImgUrl() != null && !i.getImgUrl().isEmpty())
                    .map(i -> {
                        ProductImage image = new ProductImage();
                        image.setImgUrl(i.getImgUrl());
                        image.setDisplayOrder(i.getDisplayOrder());
                        image.setProduct(product);
                        return image;
                    })
                    .collect(Collectors.toList());
            product.setImages(images);
        } else {
            product.setImages(new ArrayList<>());
        }
    }

    // Ánh xạ từ Entity sang ProductDTO
    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getId());
        dto.setName(product.getName());
        dto.setModel(product.getModel());
        dto.setSlug(product.getSlug());
        dto.setBasePrice(product.getBasePrice());
        dto.setOldPrice(product.getOldPrice());
        dto.setBrandName(product.getBrand().getName());

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            String mainImageUrl = product.getImages().stream()
                    .min(Comparator.comparing(ProductImage::getDisplayOrder))
                    .map(ProductImage::getImgUrl)
                    .orElse(null);
            dto.setMainImageUrl(mainImageUrl);
        } else {
            dto.setMainImageUrl(null);
        }

        return dto;
    }

    // Ánh xạ từ Entity sang ProductDetailDTO
    private ProductDetailDTO mapToDetailDTO(Product product) {
        Hibernate.initialize(product.getVariants());
        Hibernate.initialize(product.getSpecs());
        Hibernate.initialize(product.getImages());

        List<ProductVariantDTO> variants = product.getVariants().stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getColor(), v.getStorage(),
                        v.getPriceAdjustment(), v.getStockQuantity()))
                .collect(Collectors.toList());
        List<ProductSpecDTO> specs = product.getSpecs().stream()
                .map(s -> new ProductSpecDTO(s.getId(), s.getSpecName(), s.getSpecValue()))
                .collect(Collectors.toList());
        List<ProductImageDTO> images = product.getImages().stream()
                .map(i -> new ProductImageDTO(i.getId(), i.getImgUrl(), i.getDisplayOrder()))
                .collect(Collectors.toList());

        List<ReviewDTO> reviews = reviewRepository.findByProductId(product.getId()).stream()
                .map(r -> new ReviewDTO(r.getId(), r.getRating(), r.getComment(),
                        r.getUser().getId(), r.getUser().getName(), r.getCreatedAt()))
                .collect(Collectors.toList());

        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setProductId(product.getId());
        dto.setName(product.getName());
        dto.setModel(product.getModel());
        dto.setSlug(product.getSlug());
        dto.setBasePrice(product.getBasePrice());
        dto.setOldPrice(product.getOldPrice());
        dto.setBrandName(product.getBrand().getName());
        dto.setVariants(variants);
        dto.setSpecs(specs);
        dto.setImages(images);
        dto.setReviews(reviews);
        return dto;
    }
}