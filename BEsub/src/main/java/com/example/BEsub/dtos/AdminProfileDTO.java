package com.example.BEsub.dtos;

import com.example.BEsub.enums.Gender;
import com.example.BEsub.enums.Role;
import com.example.BEsub.models.User;

import lombok.*;
import java.time.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileDTO {
    private Long id;
    private String email;
    private String name;
    private String username;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
    private Role role;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private List<UserAddressDTO> addresses;
}
