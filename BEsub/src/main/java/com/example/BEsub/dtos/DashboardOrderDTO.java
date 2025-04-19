package com.example.BEsub.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DashboardOrderDTO {
    private Long orderId;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal totalAmount;
}
