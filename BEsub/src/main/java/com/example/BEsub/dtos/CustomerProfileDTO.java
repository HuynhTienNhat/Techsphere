package com.example.BEsub.dtos;

import com.example.BEsub.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerProfileDTO {
    private String email;
    private String name;
    private String username;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private List<UserAddressDTO> addresses;
    private String role;
}
