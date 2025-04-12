package com.example.BEsub.dtos;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
}
