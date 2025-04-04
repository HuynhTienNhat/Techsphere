package com.example.BEsub.dtos;

import com.example.BEsub.enums.Gender;
import lombok.*;

import java.time.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterDTO {
    private String email;
    private String name;
    private String username;
    private String password;
    private String phone;
    private Gender gender;
    private LocalDate dateOfBirth;
}
