package com.minimart.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sliders")
@Data
public class Slider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Trong DB dùng INT

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "link_url")
    private String linkUrl;

    private String title;
    private String description;
    private String status;

    @Column(name = "order_number")
    private Integer orderNumber;
}