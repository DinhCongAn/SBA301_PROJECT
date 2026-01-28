package com.minimart.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @Column(name = "order_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "order_code", nullable = false, length = 50)
    private String orderCode;

    @ColumnDefault("getdate()")
    @Column(name = "order_date")
    private Instant orderDate;

    @NotNull
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @ColumnDefault("'PENDING'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Size(max = 500)
    @NotNull
    @Nationalized
    @Column(name = "shipping_address", nullable = false, length = 500)
    private String shippingAddress;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @ColumnDefault("getdate()")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

}