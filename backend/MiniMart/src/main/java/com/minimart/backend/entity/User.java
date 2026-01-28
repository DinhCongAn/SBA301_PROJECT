package com.minimart.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Nationalized;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "Users")
public class User {
    @Id
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Nationalized
    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Size(max = 255)
    @NotNull
    @Nationalized
    @Column(name = "password", nullable = false)
    private String password;

    @Size(max = 100)
    @NotNull
    @Nationalized
    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Size(max = 20)
    @Nationalized
    @Column(name = "phone", length = 20)
    private String phone;

    @Size(max = 100)
    @Nationalized
    @Column(name = "full_name", length = 100)
    private String fullName;

    @Size(max = 20)
    @NotNull
    @Nationalized
    @ColumnDefault("'CUSTOMER'")
    @Column(name = "role", nullable = false, length = 20)
    private String role;

    @ColumnDefault("getdate()")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

}