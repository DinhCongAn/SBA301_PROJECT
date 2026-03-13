package com.minimart.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users") // Tên bảng trong database
@Data // Lombok tự động tạo Getter, Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng ID
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "role", nullable = false, length = 20)
    private String role = "CUSTOMER"; // Mặc định là khách hàng

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "avatar_url", columnDefinition = "VARCHAR(MAX)")
    private String avatarUrl;

    // Tự động set thời gian khi tạo mới tài khoản
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Tự động set thời gian khi cập nhật tài khoản
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}