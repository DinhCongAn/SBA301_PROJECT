package com.minimart.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "Orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(name = "order_code", unique = true, nullable = false)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "shipping_address", nullable = false, length = 1000)
    private String shippingAddress;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod; //

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

    @Column(name = "order_date", updatable = false)
    private Instant orderDate;

    @PrePersist
    protected void onCreate() { this.orderDate = Instant.now(); }

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER)
    private java.util.List<OrderItem> orderItems;
}