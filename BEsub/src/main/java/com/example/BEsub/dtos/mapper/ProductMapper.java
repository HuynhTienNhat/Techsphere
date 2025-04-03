package com.example.BEsub.dtos.mapper;

import com.example.BEsub.dtos.request.ProductCreateRequest;
import com.example.BEsub.dtos.request.ProductUpdateRequest;
import com.example.BEsub.dtos.response.ProductListResponse;
import com.example.BEsub.dtos.response.ProductResponse;
import com.example.BEsub.dtos.response.SpecResponse;
import com.example.BEsub.models.Product;
import com.example.BEsub.models.ProductImage;
import com.example.BEsub.models.ProductVariant;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final ModelMapper modelMapper;

    public Product toEntity(ProductCreateRequest request) {
        Product product = modelMapper.map(request, Product.class);
        product.setSlug(generateSlug(request.getBrand(), request.getModel()));
        product.setMainImageUrl(request.getImageUrls().getFirst());

        return product;
    }

    // Entity → Detailed Response
    public ProductResponse toResponse(Product product) {
        ProductResponse response = modelMapper.map(product, ProductResponse.class);
        response.setGalleryImages(
                product.getImages().stream()
                        .sorted(Comparator.comparing(ProductImage::getDisplayOrder))
                        .map(ProductImage::getImageUrl)
                        .toList()
        );
        response.setSpecs(
                product.getSpecs().stream()
                        .map(spec -> new SpecResponse(spec.getSpecName(), spec.getSpecValue()))
                        .toList()
        );
        return response;
    }

    // Entity → List Response
    public ProductListResponse toListResponse(Product product) {
        ProductListResponse response = modelMapper.map(product, ProductListResponse.class);
        response.setAvailableColors(
                product.getVariants().stream()
                        .map(ProductVariant::getColor)
                        .distinct()
                        .toList()
        );
        return response;
    }


    public void updateFromRequest(@Valid ProductUpdateRequest request, Product product) {
        // 1. Price Update
        Optional.ofNullable(request.getPrice())
                .ifPresent(product::setPrice);

        // 2. Release Date Update
        Optional.ofNullable(request.getReleaseDate())
                .ifPresent(product::setReleaseDate);

        // 3. Image Updates (Safe Handling)
        Optional.ofNullable(request.getNewImageUrls())
                .filter(urls -> !urls.isEmpty())
                .ifPresent(urls -> {
                    product.setMainImageUrl(urls.getFirst());
                    // Add more image logic if needed
                });
    }

    private String generateSlug(String brand, String model) {
        return (brand + "-" + model).toLowerCase().replace(" ", "-");
    }
}
