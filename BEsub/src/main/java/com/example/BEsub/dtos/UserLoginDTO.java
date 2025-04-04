package com.example.BEsub.dtos;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginDTO {
    private String usernameOrEmail;
    private String password;
}
