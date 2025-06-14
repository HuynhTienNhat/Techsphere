package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
            if (screenSize <= 0 || screenSize > 20) {
                throw new AppException("Màn hình must be a number between 0 and 20");
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
            if (frontCamera < 0 || frontCamera > 100) {
                throw new AppException("Camera trước must be a number between 0 and 100");
            }
        } catch (NumberFormatException e) {
            throw new AppException("Camera trước must be a valid number (e.g., 12)");
        }

        // Camera sau: 1-5 số
        if (request.getRearCamera() == null || request.getRearCamera().isBlank()) {
            throw new AppException("Camera sau cannot be null or blank");
        }
        String[] rearCameraParts = request.getRearCamera().trim().split("\\s+");
        if (rearCameraParts.length < 1 || rearCameraParts.length > 5) {
            throw new AppException("Camera sau must have 1 to 5 values (e.g., '48 12')");
        }
        for (String part : rearCameraParts) {
            try {
                int camera = Integer.parseInt(part);
                if (camera <= 0 || camera > 500) {
                    throw new AppException("Each Camera sau value must be between 1 and 500");
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
    public ProductDTO updateProduct(Long productId, ProductUpdateDTO productUpdateDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));

        Product existingProduct = productRepository.findBySlug(productUpdateDTO.getSlug());
        if (existingProduct != null && !existingProduct.getId().equals(productId)) {
            throw new AppException("Slug already exists");
        }

        try {
            mapToEntity(productUpdateDTO, product);
            Product updatedProduct = productRepository.save(product);
            return mapToDTO(updatedProduct);
        } catch (Exception e) {
            throw new AppException("Failed to update product: " + e.getMessage());
        }
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
    public List<ProductDTO> getProductsByBrandAndSort(String brandName, String sortBy) {
        Brand brand = brandRepository.findByName(brandName)
                .orElseThrow(() -> new AppException("Brand not found"));

        List<Product> products;

        if ("desc".equalsIgnoreCase(sortBy)) {
            products = productRepository.findByBrandOrderByBasePriceDesc(brand);
        } else if ("asc".equalsIgnoreCase(sortBy)) {
            products = productRepository.findByBrandOrderByBasePriceAsc(brand);
        } else {
            products = productRepository.findByBrand(brand);
        }

        return products.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getProductReview(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));
        ProductDTO productDTO = mapToDTO(product);
        return productDTO.getReviews();
    }

    @Override
    public RatingDTO getRatingInformation(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException("Product not found"));
        ProductDTO productDTO = mapToDTO(product);
        List<ReviewDTO> reviewDTOs = productDTO.getReviews();

        BigDecimal sum = new BigDecimal(0);
        int ratingCount = reviewDTOs.size();
        for (ReviewDTO reviewDTO : reviewDTOs) {
            sum = sum.add(new BigDecimal(reviewDTO.getRating()));
        }
        List<RatingStarDTO> ratingData = new ArrayList<>();
        List<Integer> ratings = getRatings(reviewDTOs);
        for (int i = 1; i <= 5; i++) {
            ratingData.add(new RatingStarDTO(i, ratings.get(i - 1)));
        }

        return RatingDTO.builder()
                .averageRating(ratingCount > 0 ? sum.divide(new BigDecimal(ratingCount), 1, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                .ratingCount(ratingCount)
                .ratingStarList(ratingData)
                .build();
    }

    @Override
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchByNameOrModel(keyword).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsSortedBySales(String sortOrder) {
        if ("desc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllByOrderBySalesDesc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else if ("asc".equalsIgnoreCase(sortOrder)) {
            return productRepository.findAllByOrderBySalesAsc().stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new AppException("Invalid sort order. Use 'asc' or 'desc'");
        }
    }

    @Override
    public List<ProductDTO> getTop6BestSellingProducts() {
        Pageable pageable = PageRequest.of(0, 6);
        return productRepository.findTop6ByOrderBySalesDesc(pageable).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getTop6NewProducts() {
        return productRepository.findTop6ByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void mapToEntity(ProductUpdateDTO dto, Product product) {
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
        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            // Validate: Chỉ 1 isDefault trong payload
            long defaultCount = dto.getVariants().stream().filter(ProductVariantDTO::isDefault).count();
            if (defaultCount > 1) {
                throw new AppException("Only one variant can be set as default");
            }

            // Lấy danh sách variants hiện có
            List<ProductVariant> variants = product.getVariants();

            // Xử lý variants từ DTO
            for (ProductVariantDTO vDto : dto.getVariants()) {
                // Nếu variant được đánh dấu xóa
                if (vDto.isDeleted() && vDto.getVariantId() != null) {
                    variants.removeIf(v -> v.getId().equals(vDto.getVariantId()));
                    continue;
                }

                // Bỏ qua nếu isDeleted = true nhưng không có variantId
                if (vDto.isDeleted()) {
                    continue;
                }

                ProductVariant variant;
                if (vDto.getVariantId() != null) {
                    // Tìm variant hiện có
                    variant = variants.stream()
                            .filter(v -> v.getId().equals(vDto.getVariantId()))
                            .findFirst()
                            .orElseGet(() -> {
                                // Nếu không tìm thấy, tạo mới và thêm vào danh sách
                                ProductVariant newVariant = new ProductVariant();
                                newVariant.setProduct(product);
                                variants.add(newVariant);
                                return newVariant;
                            });
                } else {
                    // Tạo variant mới
                    variant = new ProductVariant();
                    variant.setProduct(product);
                    variants.add(variant);
                }
                // Nếu variant này là default, đặt tất cả variants khác thành false
                if (vDto.isDefault()) {
                    variants.forEach(v -> v.setDefault(false));
                }
                variant.setColor(vDto.getColor());
                variant.setStorage(vDto.getStorage());
                variant.setPriceAdjustment(vDto.getPriceAdjustment());
                variant.setStockQuantity(vDto.getStockQuantity());
                variant.setDefault(vDto.isDefault());
            }

            // Đảm bảo chỉ có 1 isDefault
            long finalDefaultCount = variants.stream().filter(ProductVariant::isDefault).count();
            if (finalDefaultCount > 1) {
                // Nếu vẫn có nhiều default, giữ default của variant cuối cùng trong DTO
                variants.forEach(v -> v.setDefault(false));
                for (int i = dto.getVariants().size() - 1; i >= 0; i--) {
                    ProductVariantDTO vDto = dto.getVariants().get(i);
                    if (vDto.isDefault()) {
                        variants.stream()
                                .filter(v -> (vDto.getVariantId() != null && v.getId().equals(vDto.getVariantId())) ||
                                        (vDto.getVariantId() == null && v.getColor().equals(vDto.getColor()) && v.getStorage().equals(vDto.getStorage())))
                                .findFirst()
                                .ifPresent(v -> v.setDefault(true));
                        break;
                    }
                }
            } else if (finalDefaultCount == 0 && !variants.isEmpty()) {
                // Nếu không có default, đặt variant đầu tiên làm default
                variants.get(0).setDefault(true);
            }
        }
        // Nếu variants là null hoặc rỗng, giữ nguyên variants hiện có
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
        product.setSales(0);

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

    private List<Integer> getRatings(List<ReviewDTO> reviewDTOs) {
        List<Integer> counts = new ArrayList<>(Collections.nCopies(5, 0));

        for (ReviewDTO review : reviewDTOs) {
            int rating = review.getRating();
            if (rating >= 1 && rating <= 5) {
                // Trừ 1 vì index bắt đầu từ 0
                counts.set(rating - 1, counts.get(rating - 1) + 1);
            }
        }

        return counts;
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
        dto.setSales(product.getSales());

        // Ánh xạ Variants
        List<ProductVariantDTO> variants = product.getVariants().stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getColor(), v.getStorage(),
                        v.getPriceAdjustment(), v.getStockQuantity(), v.isDefault(), false))
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
                        r.getUser().getId(), r.getUser().getName(), r.getCreatedAt(), r.getVariantName()))
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