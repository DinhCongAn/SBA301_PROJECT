package com.minimart.backend.dto;
import lombok.Data;
@Data public class RegisterRequest {
    private String fullName;
    private String username;
    private String email;
    private String phone;
    private String password; }