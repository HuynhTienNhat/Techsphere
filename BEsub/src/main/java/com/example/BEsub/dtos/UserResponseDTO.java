package com.example.BEsub.dtos;

import com.example.BEsub.enums.Gender;
import com.example.BEsub.enums.Role;
import com.example.BEsub.models.User;

import java.time.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
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
}
