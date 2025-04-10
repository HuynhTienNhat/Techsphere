package com.example.BEsub.dtos;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusChangeDTO {
    private Long userId;
    private Long orderId;
    private String status;
}
