package com.example.BEsub.enums;

public enum PaymentMethod {
    COD, BANKING;

    public static PaymentMethod fromString(String method) {
        for (PaymentMethod paymentMethod : PaymentMethod.values()) {
            if (paymentMethod.name().equalsIgnoreCase(method)) {
                return paymentMethod;
            }
        }
        throw new IllegalArgumentException("Unknown payment method: " + method);
    }
}
