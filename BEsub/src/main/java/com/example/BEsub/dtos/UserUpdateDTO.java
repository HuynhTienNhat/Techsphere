package com.example.BEsub.dtos;

import com.example.BEsub.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    private String name; // Optional
    private String phone; // Optional
    private Gender gender; // Optional
    private LocalDate dateOfBirth; // Optional
}
