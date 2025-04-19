package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChartDataDTO {
    private String month;
    private BigDecimal revenue;
}
