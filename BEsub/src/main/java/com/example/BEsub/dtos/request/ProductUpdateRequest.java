package com.example.BEsub.dtos.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProductUpdateRequest {
    @Positive
    private BigDecimal price;

    @FutureOrPresent
    private LocalDate releaseDate;

    private List<String> newImageUrls;     // Add new images
    private List<Long> deletedImageIds;    // Remove images
}