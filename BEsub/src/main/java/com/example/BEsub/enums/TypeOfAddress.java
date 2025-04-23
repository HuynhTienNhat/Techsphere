package com.example.BEsub.enums;

public enum TypeOfAddress {
    HOME("Nhà riêng"),
    WORK("Văn phòng");

    private final String type;

    TypeOfAddress(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public static TypeOfAddress valueOfType(String type) {
        for (TypeOfAddress t : values()) {
            if (t.getType().equalsIgnoreCase(type)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Invalid address type: " + type);
    }
}
