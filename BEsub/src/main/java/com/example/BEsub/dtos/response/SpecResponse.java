package com.example.BEsub.dtos.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecResponse {
    private String name;  // Frontend-friendly name (e.g., "RAM" vs "spec_ram")
    private String value;  // Frontend-friendly value (e.g., "16GB" vs "spec_ram_value_16GB")
}
