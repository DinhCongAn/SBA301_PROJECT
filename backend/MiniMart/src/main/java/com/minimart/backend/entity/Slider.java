package com.minimart.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@Entity
@Table(name = "sliders")
public class Slider {
    @Id
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Size(max = 255)
    @Nationalized
    @Column(name = "link_url")
    private String linkUrl;

    @Size(max = 255)
    @Nationalized
    @Column(name = "title")
    private String title;

    @Nationalized
    @Lob
    @Column(name = "description")
    private String description;

    @Size(max = 50)
    @Nationalized
    @ColumnDefault("'active'")
    @Column(name = "status", length = 50)
    private String status;

    @ColumnDefault("0")
    @Column(name = "order_number")
    private Integer orderNumber;

}