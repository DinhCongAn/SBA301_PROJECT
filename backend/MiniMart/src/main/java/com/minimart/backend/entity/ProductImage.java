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
@Table(name = "Product_Images")
public class ProductImage {
    @Id
    @Column(name = "image_id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Size(max = 500)
    @NotNull
    @Nationalized
    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @ColumnDefault("0")
    @Column(name = "sort_order")
    private Integer sortOrder;

}