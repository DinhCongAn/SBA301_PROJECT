package com.minimart.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "full_name", length = 100)
    private String fullName;

    // 🚀 BỔ SUNG 2 TRƯỜNG MỚI
    @Column(name = "avatar_url", columnDefinition = "NVARCHAR(MAX)")
    private String avatarUrl;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, length = 20)
    private String role = "USER"; // "ADMIN" hoặc "USER"

    // --- TỰ ĐỘNG QUẢN LÝ NGÀY THÁNG ---
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Hàm này tự động chạy TRƯỚC KHI lưu User mới vào CSDL
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Hàm này tự động chạy TRƯỚC KHI cập nhật User (đổi mật khẩu, sửa tên...)
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}