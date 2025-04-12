package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class AverageRatingDTO {
    private BigDecimal rating;
    private Integer reviewCount;
}
