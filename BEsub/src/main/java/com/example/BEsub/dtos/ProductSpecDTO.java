package com.example.BEsub.dtos;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecDTO {
    private Long specId;
    private String specName;
    private String specValue;
}