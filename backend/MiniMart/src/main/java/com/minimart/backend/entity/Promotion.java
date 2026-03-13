package com.minimart.backend.entity;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Promotions")
@Data
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(name = "discount_type", nullable = false)
    private String discountType;

    @Column(name = "discount_value", nullable = false)
    private Double discountValue;

    @Column(name = "min_order_amount")
    private Double minOrderAmount;

    @Column(name = "is_active")
    private Boolean isActive = true;
}