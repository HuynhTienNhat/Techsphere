package com.example.BEsub.dtos;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewCreateDTO {
    private Integer rating;
    private String comment;
    private Long productId;
    private Long orderId;
    private String variantName;
}
