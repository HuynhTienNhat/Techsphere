package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class OTP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email",unique = true)
    private String email;

    @Column(name = "otp")
    private String otp;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "expired_at")
    private LocalDateTime expired_at;

    @Column(name = "tryTime")
    private int tryTime = 0;
}
