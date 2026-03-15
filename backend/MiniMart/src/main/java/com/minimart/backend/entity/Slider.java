package com.minimart.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sliders")
@Data
public class Slider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "image_url", columnDefinition = "NVARCHAR(MAX)")
    private String imageUrl;

    @Column(name = "link_url", columnDefinition = "NVARCHAR(MAX)")
    private String linkUrl;

    @Column(name = "order_number", nullable = false)
    private Integer orderNumber = 0;

    @Column(name = "status")
    private String status = "active";
}