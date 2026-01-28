package com.minimart.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "Addresses")
public class Address {
    @Id
    @Column(name = "address_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "street", nullable = false)
    private String street;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Size(max = 100)
    @Nationalized
    @Column(name = "province", length = 100)
    private String province;

    @Size(max = 10)
    @Nationalized
    @Column(name = "zip_code", length = 10)
    private String zipCode;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

}