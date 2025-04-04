package com.example.BEsub.dtos;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageDTO {
    private Long imageId;
    private String imgUrl;
    private Integer displayOrder;
}
