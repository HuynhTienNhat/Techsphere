package com.example.BEsub.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private Long imageId;

    @NotBlank(message = "Image URL cannot be blank")
    @Size(max = 255, message = "Image URL cannot exceed 255 characters")
    private String imgUrl;

    @NotNull(message = "Display order cannot be null")
    @Min(value = 0, message = "Display order must be at least 0")
    private Integer displayOrder;
}
