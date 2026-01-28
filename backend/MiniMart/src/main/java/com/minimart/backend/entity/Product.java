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
@Table(name = "Products")
public class Product {
    @Id
    @Column(name = "product_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "name", nullable = false)
    private String name;

    @Nationalized
    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Size(max = 500)
    @Nationalized
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @ColumnDefault("'active'")
    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @ColumnDefault("getdate()")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

}