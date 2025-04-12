package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private BrandRepository brandRepository;

    @Transactional
    public ProductDetailDTO createProduct(ProductCreateRequest request) {
        // Kiểm tra slug đã tồn tại chưa
        if (productRepository.findBySlug(request.getSlug()) != null) {
            throw new AppException("Slug already exists");
        }

        // Kiểm tra imageFiles và displayOrders có cùng kích thước không
        if (request.getImageFiles() != null && request.getDisplayOrders() != null &&
                request.getImageFiles().size() != request.getDisplayOrders().size()) {
            throw new AppException("Number of images and display orders must match");
        }

        // Tạo sản phẩm mới
        Product product = new Product();
        mapToEntity(request, product);
        Product savedProduct = productRepository.save(product);

        // Upload hình ảnh lên Cloudinary và lưu URL
        if (request.getImageFiles() != null && !request.getImageFiles().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageFiles().size(); i++) {
                MultipartFile imageFile = request.getImageFiles().get(i);
                Integer displayOrder = request.getDisplayOrders().get(i);

                // Upload lên Cloudinary
                String folder = "products/" + savedProduct.getId();
                String publicId = displayOrder == 0 ? "main" : "image-" + displayOrder;
                String imageUrl;
                try {
                    imageUrl = cloudinaryService.uploadImage(imageFile, folder, publicId);
                } catch (Exception e) {
                    throw new AppException("Failed to upload image to Cloudinary: " + e.getMessage());
                }

                // Lưu vào ProductImage
                ProductImage image = new ProductImage();
                image.setImgUrl(imageUrl);
                image.setDisplayOrder(displayOrder);
                image.setProduct(savedProduct);
                images.add(image);
            }
            productImageRepository.saveAll(images);
            savedProduct.setImages(images);
        }

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
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));

        // Xóa hình ảnh trên Cloudinary
        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                String publicId = "products/" + productId + "/" + (image.getDisplayOrder() == 0 ? "main" : "image-" + image.getDisplayOrder());
                try {
                    cloudinaryService.deleteImage(publicId);
                } catch (Exception e) {
                    // Log lỗi, không ném ngoại lệ để tiếp tục xóa sản phẩm
                    System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
                }
            }
        }

        productRepository.delete(product);
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
    public List<ReviewDTO> getProductReview(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(()-> new AppException("Product not found"));
        ProductDetailDTO productDetailDTO = mapToDetailDTO(product);
        return productDetailDTO.getReviews();
    }

    @Override
    public AverageRatingDTO getAverageRating(Long productId) {
        Product product = productRepository.findById(productId).orElseThrow(()-> new AppException("Product not found"));
        ProductDetailDTO productDetailDTO = mapToDetailDTO(product);
        List<ReviewDTO> reviewDTOS = productDetailDTO.getReviews();

        BigDecimal sum = new BigDecimal(0);
        int ratingCount = Math.toIntExact(reviewDTOS.size());
        for(ReviewDTO reviewDTO : reviewDTOS){
            sum = sum.add(new BigDecimal(reviewDTO.getRating()));
        }
        return AverageRatingDTO.builder()
                .rating(sum.divide(new BigDecimal(ratingCount), 2, RoundingMode.HALF_UP))
                .reviewCount(ratingCount)
                .build();
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

    private void mapToEntity(ProductCreateRequest request, Product product) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new AppException("Product name cannot be null or blank");
        }

        product.setName(request.getName());
        product.setModel(request.getModel());
        product.setSlug(request.getSlug());
        product.setBasePrice(request.getBasePrice());
        product.setOldPrice(request.getOldPrice());

        // Ánh xạ Brand
        String brandName = request.getBrandName();
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
        if (request.getVariants() != null) {
            List<ProductVariant> variants = request.getVariants().stream()
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
        if (request.getSpecs() != null) {
            List<ProductSpec> specs = request.getSpecs().stream()
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
    }
}