package com.example.BEsub.models;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_addresses")
public class Address extends BaseEntity{
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String city;
    private String street;

    @Column(name = "house_number")
    private String houseNumber;

    @Column(name = "is_default")
    private Boolean isDefault;
}
