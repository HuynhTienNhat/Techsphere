package com.example.BEsub.models;

import com.example.BEsub.enums.*;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order extends BaseEntity {
    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    private BigDecimal subtotal;

    @Column(name = "shipping_fee")
    private BigDecimal shippingFee;

    @Column(name = "discount_code")
    private String discountCode;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    // Quan hệ Many-to-One với USERS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private User user;

    // Quan hệ Many-to-One với USER_ADDRESS
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private UserAddress address;

    // Quan hệ One-to-Many với ORDER_ITEMS
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems;

    public BigDecimal caculateTotalAmount(){
        return subtotal.add(shippingFee).subtract(discountAmount);
    }
}
