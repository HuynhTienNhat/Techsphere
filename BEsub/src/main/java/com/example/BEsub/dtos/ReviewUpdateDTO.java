package com.example.BEsub.dtos;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class ReviewUpdateDTO {
    private Integer rating;
    private String comment;
}
