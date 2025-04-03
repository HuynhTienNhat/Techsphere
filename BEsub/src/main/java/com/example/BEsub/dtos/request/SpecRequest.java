package com.example.BEsub.dtos.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class SpecRequest {
    @NotBlank(message = "Spec name is required")
    private String name;  // Maps to specName in entity

    @NotBlank(message = "Spec value is required")
    private String value; // Maps to specValue in entity
}
