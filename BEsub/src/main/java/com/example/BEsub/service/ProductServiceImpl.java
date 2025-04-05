package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional
    @Override
    public ProductDetailDTO createProduct(ProductDetailDTO productDTO) {
        Product product = new Product();
        mapToEntity(productDTO, product);
        Product savedProduct = productRepository.save(product);
        return mapToDetailDTO(savedProduct);
    }

    @Transactional
    @Override
    public ProductDetailDTO updateProduct(Long productId, ProductDetailDTO productDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));
        mapToEntity(productDTO, product);
        Product updatedProduct = productRepository.save(product);
        return mapToDetailDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Long productId) {
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
        return productRepository.findByBrandName(brandName).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsSortedByPrice(String sortOrder) {
        if ("desc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllByOrderByBasePriceDesc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else {
            return productRepository.findAllByOrderByBasePriceAsc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
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
        product.setName(dto.getName());
        product.setModel(dto.getModel());
        product.setSlug(dto.getSlug());
        product.setBasePrice(dto.getBasePrice());
        product.setOldPrice(dto.getOldPrice());

        // Ánh xạ Category
        Category category = categoryRepository.findByName(dto.getCategoryName());
        if (category == null) {
            category = new Category();
            category.setName(dto.getCategoryName());
            category = categoryRepository.save(category);
        }
        product.setCategory(category);

        // Ánh xạ Brand
        Brand brand = brandRepository.findByName(dto.getBrandName());
        if (brand == null) {
            brand = new Brand();
            brand.setName(dto.getBrandName());
            brand = brandRepository.save(brand);
        }
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
            List<ProductImage> images = dto.getImages().stream().
                    filter(i -> i.getImgUrl() != null && !i.getImgUrl().isEmpty())
                    .map(i -> {
                        ProductImage image = new ProductImage();
                        image.setImgUrl(i.getImgUrl());
                        image.setDisplayOrder(i.getDisplayOrder());
                        image.setProduct(product);
                        return image;
                    })
                    .collect(Collectors.toList());
            product.setImages(images);
        }else {
            product.setImages(new ArrayList<>());
        }

        // Thêm: ánh xạ và lưu reviews từ DTO
//        if (dto.getReviews() != null && !dto.getReviews().isEmpty()) {
//            List<Review> reviews = dto.getReviews().stream()
//                    .map(r -> {
//                        Review review = new Review();
//                        review.setRating(r.getRating());
//                        review.setComment(r.getComment());
//                        review.setProduct(product);
//                        // Lấy User và Order từ repository (giả sử ID hợp lệ)
//                        User user = userRepository.findById(r.getUserId())
//                                .orElseThrow(() -> new AppException("User not found for review"));
//                        review.setUser(user);
//                        Order order = orderRepository.findById(1L) // Giả lập orderId, cần điều chỉnh thực tế
//                                .orElseThrow(() -> new AppException("Order not found for review"));
//                        review.setOrder(order);
//                        return review;
//                    })
//                    .collect(Collectors.toList());
//            product.setReviews(reviews);
//        } else {
//            product.setReviews(new ArrayList<>());
//        }
    }

    // Ánh xạ từ Entity sang ProductDTO
    private ProductDTO mapToDTO(Product product) {
        return new ProductDTO(
                product.getId(), product.getName(), product.getModel(), product.getSlug(),
                product.getBasePrice(),product.getOldPrice() ,product.getCategory().getName(), product.getBrand().getName()
        );
    }

    // Ánh xạ từ Entity sang ProductDetailDTO
    private ProductDetailDTO mapToDetailDTO(Product product) {
        // Tải các danh sách liên quan nếu chưa được tải
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

        // Tải các đánh giá liên quan nếu cần
        List<ReviewDTO> reviews = reviewRepository.findByProductId(product.getId()).stream()
                .map(r -> new ReviewDTO(r.getId(), r.getRating(), r.getComment(), r.getUser().getId(), r.getUser().getName(), r.getCreatedAt()))
                .collect(Collectors.toList());

        return new ProductDetailDTO(
                product.getId(), product.getName(), product.getModel(), product.getSlug(),
                product.getBasePrice(), product.getOldPrice() ,product.getCategory().getName(), product.getBrand().getName(),
                variants, specs, images, reviews
        );
    }
}