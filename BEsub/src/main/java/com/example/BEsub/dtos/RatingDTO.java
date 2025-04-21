package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class RatingDTO {
    private int ratingCount;
    private BigDecimal averageRating;
    private List<RatingStarDTO> ratingStarList;
}
