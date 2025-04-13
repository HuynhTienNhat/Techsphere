package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import jakarta.transaction.Transactional;
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

    // Các specName cố định
    private static final Map<String, String> SPEC_FIELDS = new LinkedHashMap<>() {{
        put("Màn hình", "screen");
        put("RAM", "ram");
        put("Camera trước", "frontCamera");
        put("Camera sau", "rearCamera");
        put("Pin", "pin");
    }};

    // Hàm validate specs
    private void validateSpecs(ProductCreateRequest request) {
        // Màn hình: Số thập phân
        if (request.getScreen() == null || request.getScreen().isBlank()) {
            throw new AppException("Màn hình cannot be null or blank");
        }
        try {
            double screenSize = Double.parseDouble(request.getScreen());
            if (screenSize <= 0 || screenSize > 10) {
                throw new AppException("Màn hình must be a number between 0 and 10");
            }
        } catch (NumberFormatException e) {
            throw new AppException("Màn hình must be a valid number (e.g., 6.7)");
        }

        // RAM: Số nguyên
        if (request.getRam() == null || request.getRam().isBlank()) {
            throw new AppException("RAM cannot be null or blank");
        }
        try {
            int ramSize = Integer.parseInt(request.getRam());
            if (ramSize <= 0 || ramSize > 128) {
                throw new AppException("RAM must be a number between 1 and 128");
            }
        } catch (NumberFormatException e) {
            throw new AppException("RAM must be a valid number (e.g., 8)");
        }

        // Camera trước: Số nguyên
        if (request.getFrontCamera() == null || request.getFrontCamera().isBlank()) {
            throw new AppException("Camera trước cannot be null or blank");
        }
        try {
            int frontCamera = Integer.parseInt(request.getFrontCamera());
            if (frontCamera <= 0 || frontCamera > 100) {
                throw new AppException("Camera trước must be a number between 1 and 100");
            }
        } catch (NumberFormatException e) {
            throw new AppException("Camera trước must be a valid number (e.g., 12)");
        }

        // Camera sau: 1-3 số
        if (request.getRearCamera() == null || request.getRearCamera().isBlank()) {
            throw new AppException("Camera sau cannot be null or blank");
        }
        String[] rearCameraParts = request.getRearCamera().trim().split("\\s+");
        if (rearCameraParts.length < 1 || rearCameraParts.length > 3) {
            throw new AppException("Camera sau must have 1 to 3 values (e.g., '48 12')");
        }
        for (String part : rearCameraParts) {
            try {
                int camera = Integer.parseInt(part);
                if (camera <= 0 || camera > 100) {
                    throw new AppException("Each Camera sau value must be between 1 and 100");
                }
            } catch (NumberFormatException e) {
                throw new AppException("Camera sau must contain valid numbers (e.g., '48 12')");
            }
        }

        // Pin: Số nguyên
        if (request.getPin() == null || request.getPin().isBlank()) {
            throw new AppException("Pin cannot be null or blank");
        }
        try {
            int pinSize = Integer.parseInt(request.getPin());
            if (pinSize < 1000 || pinSize > 10000) {
                throw new AppException("Pin must be a number between 1000 and 10000");
            }
        } catch (NumberFormatException e) {
            throw new AppException("Pin must be a valid number (e.g., 4000)");
        }
    }

    @Transactional
    @Override
    public ProductDTO createProduct(ProductCreateRequest request) {
        // Kiểm tra slug
        if (productRepository.findBySlug(request.getSlug()) != null) {
            throw new AppException("Slug already exists");
        }

        // Kiểm tra imageFiles và displayOrders
        if (request.getImageFiles() == null || request.getImageFiles().isEmpty()) {
            throw new AppException("At least one image is required");
        }
        if (request.getImageFiles().size() != request.getDisplayOrders().size()) {
            throw new AppException("Number of images and display orders must match");
        }

        // Kiểm tra variants
        if (request.getVariants() == null || request.getVariants().isEmpty()) {
            throw new AppException("At least one variant is required");
        }

        // Validate specs
        validateSpecs(request);

        // Validate variants: Chỉ 1 isDefault
        long defaultCount = request.getVariants().stream().filter(ProductVariantDTO::isDefault).count();
        if (defaultCount > 1) {
            throw new AppException("Only one variant can be set as default");
        }
        if (defaultCount == 0) {
            // Tự động chọn variant đầu tiên làm mặc định
            request.getVariants().get(0).setDefault(true);
        }

        // Tạo sản phẩm mới
        Product product = new Product();
        mapToEntity(request, product);
        Product savedProduct = productRepository.save(product);

        // Upload hình ảnh
        List<ProductImage> images = new ArrayList<>();
        for (int i = 0; i < request.getImageFiles().size(); i++) {
            MultipartFile imageFile = request.getImageFiles().get(i);
            Integer displayOrder = request.getDisplayOrders().get(i);
            String folder = "products/" + savedProduct.getId();
            String publicId = displayOrder == 0 ? "main" : "image-" + displayOrder;
            String imageUrl;
            try {
                imageUrl = cloudinaryService.uploadImage(imageFile, folder, publicId);
            } catch (Exception e) {
                throw new AppException("Failed to upload image: " + e.getMessage());
            }
            ProductImage image = new ProductImage();
            image.setImgUrl(imageUrl);
            image.setDisplayOrder(displayOrder);
            image.setProduct(savedProduct);
            images.add(image);
        }
        productImageRepository.saveAll(images);
        savedProduct.setImages(images);

        return mapToDTO(savedProduct);
    }

    @Transactional
    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));

        Product existingProduct = productRepository.findBySlug(productDTO.getSlug());
        if (existingProduct != null && !existingProduct.getId().equals(productId)) {
            throw new AppException("Slug already exists");
        }

        // Không cho phép cập nhật specs
        if (productDTO.getSpecs() != null && !productDTO.getSpecs().isEmpty()) {
            throw new AppException("Specs cannot be updated after product creation");
        }

        // Không cho phép cập nhật images
        if (productDTO.getImages() != null && !productDTO.getImages().isEmpty()) {
            throw new AppException("Images cannot be updated after product creation");
        }

        // Validate variants: Chỉ 1 isDefault
        if (productDTO.getVariants() != null && !productDTO.getVariants().isEmpty()) {
            long defaultCount = productDTO.getVariants().stream().filter(ProductVariantDTO::isDefault).count();
            if (defaultCount > 1) {
                throw new AppException("Only one variant can be set as default");
            }
            if (defaultCount == 0) {
                // Tự động chọn variant đầu tiên làm mặc định
                productDTO.getVariants().get(0).setDefault(true);
            }
        }

        mapToEntity(productDTO, product);
        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found"));
        return mapToDTO(product);
    }

    @Transactional
    @Override
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
                    System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
                }
            }
        }
        productRepository.delete(product);
    }

    @Override
    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug);
        if (product == null) throw new AppException("Product not found");
        return mapToDTO(product);
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
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));
        ProductDTO productDTO = mapToDTO(product);
        return productDTO.getReviews();
    }

    @Override
    public AverageRatingDTO getAverageRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));
        ProductDTO productDTO = mapToDTO(product);
        List<ReviewDTO> reviewDTOs = productDTO.getReviews();

        BigDecimal sum = new BigDecimal(0);
        int ratingCount = reviewDTOs.size();
        for (ReviewDTO reviewDTO : reviewDTOs) {
            sum = sum.add(new BigDecimal(reviewDTO.getRating()));
        }
        return AverageRatingDTO.builder()
                .rating(ratingCount > 0 ? sum.divide(new BigDecimal(ratingCount), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                .reviewCount(ratingCount)
                .build();
    }

    @Override
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchByNameOrModel(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void mapToEntity(ProductDTO dto, Product product) {
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
        List<ProductVariant> currentVariants = product.getVariants() != null ? product.getVariants() : new ArrayList<>();
        List<ProductVariant> updatedVariants = new ArrayList<>();
        Map<Long, ProductVariant> variantMap = currentVariants.stream()
                .filter(v -> v.getId() != null)
                .collect(Collectors.toMap(ProductVariant::getId, v -> v));

        if (dto.getVariants() != null) {
            for (ProductVariantDTO vDto : dto.getVariants()) {
                ProductVariant variant;
                if (vDto.getVariantId() != null && variantMap.containsKey(vDto.getVariantId())) {
                    // Cập nhật variant hiện có
                    variant = variantMap.get(vDto.getVariantId());
                    variantMap.remove(vDto.getVariantId());
                } else {
                    // Thêm variant mới
                    variant = new ProductVariant();
                    variant.setProduct(product);
                }
                variant.setColor(vDto.getColor());
                variant.setStorage(vDto.getStorage());
                variant.setPriceAdjustment(vDto.getPriceAdjustment());
                variant.setStockQuantity(vDto.getStockQuantity());
                variant.setDefault(vDto.isDefault());
                updatedVariants.add(variant);
            }
        }
        product.setVariants(updatedVariants);
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
        List<ProductVariant> variants = request.getVariants().stream()
                .map(v -> {
                    ProductVariant variant = new ProductVariant();
                    variant.setColor(v.getColor());
                    variant.setStorage(v.getStorage());
                    variant.setPriceAdjustment(v.getPriceAdjustment());
                    variant.setStockQuantity(v.getStockQuantity());
                    variant.setDefault(v.isDefault());
                    variant.setProduct(product);
                    return variant;
                })
                .collect(Collectors.toList());
        product.setVariants(variants);

        // Ánh xạ Specs
        List<ProductSpec> specs = new ArrayList<>();
        SPEC_FIELDS.forEach((specName, fieldName) -> {
            ProductSpec spec = new ProductSpec();
            spec.setSpecName(specName);
            spec.setProduct(product);
            switch (fieldName) {
                case "screen":
                    spec.setSpecValue(request.getScreen() + " inches");
                    break;
                case "ram":
                    spec.setSpecValue(request.getRam() + "GB");
                    break;
                case "frontCamera":
                    spec.setSpecValue(request.getFrontCamera() + "MP");
                    break;
                case "rearCamera":
                    String[] parts = request.getRearCamera().trim().split("\\s+");
                    spec.setSpecValue(String.join("MP + ", parts) + "MP");
                    break;
                case "pin":
                    spec.setSpecValue(request.getPin() + "mAh");
                    break;
            }
            specs.add(spec);
        });
        product.setSpecs(specs);
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
        dto.setBrandName(product.getBrand() != null ? product.getBrand().getName() : null);

        // Ánh xạ Variants
        List<ProductVariantDTO> variants = product.getVariants().stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getColor(), v.getStorage(),
                        v.getPriceAdjustment(), v.getStockQuantity(), v.isDefault()))
                .collect(Collectors.toList());
        dto.setVariants(variants);

        // Ánh xạ Specs
        List<ProductSpecDTO> specs = product.getSpecs().stream()
                .map(s -> new ProductSpecDTO(s.getId(), s.getSpecName(), s.getSpecValue()))
                .collect(Collectors.toList());
        dto.setSpecs(specs);

        // Ánh xạ Images
        List<ProductImageDTO> images = product.getImages().stream()
                .map(i -> new ProductImageDTO(i.getId(), i.getImgUrl(), i.getDisplayOrder()))
                .collect(Collectors.toList());
        dto.setImages(images);

        // Ánh xạ Reviews
        List<ReviewDTO> reviews = reviewRepository.findByProductId(product.getId()).stream()
                .map(r -> new ReviewDTO(r.getId(), r.getRating(), r.getComment(),
                        r.getUser().getId(), r.getUser().getName(), r.getCreatedAt()))
                .collect(Collectors.toList());
        dto.setReviews(reviews);

        // Main Image URL
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            String mainImageUrl = product.getImages().stream()
                    .min(Comparator.comparing(ProductImage::getDisplayOrder))
                    .map(ProductImage::getImgUrl)
                    .orElse(null);
            dto.setMainImageUrl(mainImageUrl);
        } else {
            dto.setMainImageUrl(null);
        }

        // Out of Stock
        dto.setOutOfStock(product.getVariants().stream().allMatch(v -> v.getStockQuantity() == 0));

        return dto;
    }
}