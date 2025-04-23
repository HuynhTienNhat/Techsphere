package com.example.BEsub.dtos;

import com.example.BEsub.enums.TypeOfAddress;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddressDTO {
    private Long id;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "House number is required")
    private String streetAndHouseNumber;

    private Boolean isDefault;

    @NotBlank(message = "Type of address is required")
    private String typeOfAddress;
}
