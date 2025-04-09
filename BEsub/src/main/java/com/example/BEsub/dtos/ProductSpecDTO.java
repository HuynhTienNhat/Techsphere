package com.example.BEsub.dtos;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecDTO {
    private Long specId; // Không cần validate

    @NotBlank(message = "Spec name cannot be blank")
    @Size(max = 50, message = "Spec name cannot exceed 50 characters")
    private String specName;

    @NotBlank(message = "Spec value cannot be blank")
    @Size(max = 255, message = "Spec value cannot exceed 255 characters")
    private String specValue;
}