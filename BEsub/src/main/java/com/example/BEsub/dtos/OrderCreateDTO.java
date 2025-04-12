package com.example.BEsub.dtos;

import com.example.BEsub.enums.PaymentMethod;
import com.example.BEsub.models.UserAddress;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateDTO {
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private String discountCode;
    private BigDecimal discountAmount;
    private PaymentMethod paymentMethod;
    private Long userAddressId;
}
