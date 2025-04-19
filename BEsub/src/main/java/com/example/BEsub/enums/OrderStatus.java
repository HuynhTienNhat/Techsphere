package com.example.BEsub.enums;

public enum OrderStatus {
    CONFIRMING,
    PREPARING,
    DELIVERING,
    COMPLETED,
    CANCELLED;

    public static OrderStatus fromString(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }
}
