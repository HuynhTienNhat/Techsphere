package com.example.BEsub.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddressDTO {
    private Long id;
    private String city;
    private String street;
    private String houseNumber;
    private Boolean isDefault;
}
