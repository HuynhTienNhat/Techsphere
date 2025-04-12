package com.example.BEsub.dtos;

import com.example.BEsub.enums.*;
import com.example.BEsub.models.OrderItem;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO  {
    private Long orderId;
    private LocalDateTime orderDate;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private String discountCode;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private OrderStatus status;
    private Long userId;
    private Long userAddressId;
    private List<OrderItemDTO> orderItems;
}
