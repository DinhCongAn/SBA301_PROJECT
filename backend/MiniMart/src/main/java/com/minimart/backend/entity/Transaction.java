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
@Table(name = "Transactions")
public class Transaction {
    @Id
    @Column(name = "transaction_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @ColumnDefault("getdate()")
    @Column(name = "transaction_date")
    private Instant transactionDate;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus;

    @Size(max = 255)
    @Nationalized
    @Column(name = "gateway_transaction_id")
    private String gatewayTransactionId;

    @Nationalized
    @Lob
    @Column(name = "gateway_response")
    private String gatewayResponse;

}