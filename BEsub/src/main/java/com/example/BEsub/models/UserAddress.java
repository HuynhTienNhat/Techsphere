package com.example.BEsub.models;

import com.example.BEsub.enums.TypeOfAddress;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_address")
@Data
public class UserAddress extends BaseEntity {
    private String city;

    private String district;

    @Column(name = "street_and_house_number")
    private String streetAndHouseNumber;

    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "type_of_address")
    private String typeOfAddress;

    // Quan hệ Many-to-One với USERS
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
