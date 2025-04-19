package com.example.BEsub.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardInformationDTO {
    private BigDecimal totalRevenue;
    private BigDecimal newOrders;
    private BigDecimal customers;
    private BigDecimal products;
    private List<DashboardOrderDTO> recentOrders;
    private List<ChartDataDTO> OrdersCompletedByYear;
}
