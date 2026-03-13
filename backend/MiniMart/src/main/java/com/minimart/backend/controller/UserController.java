package com.minimart.backend.controller;

import com.minimart.backend.entity.User;
import com.minimart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 1. Cập nhật thông tin cá nhân & Avatar
    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFullName(request.get("full_name"));
            user.setPhone(request.get("phone"));
            if(request.get("avatar_url") != null) {
                user.setAvatarUrl(request.get("avatar_url")); // Nhận ảnh Base64 từ React
            }
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
    }

    // 2. Đổi mật khẩu (Logic thông minh cho Google)
    @PutMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User không tồn tại");

        User user = userOpt.get();
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        // Kiểm tra xem có phải tài khoản Google chưa từng đặt mật khẩu không?
        boolean isFirstTimeGoogle = passwordEncoder.matches("GOOGLE_DEFAULT_PASS", user.getPassword());

        if (!isFirstTimeGoogle) {
            // Nếu là tài khoản thường, BẮT BUỘC phải có mật khẩu cũ và phải khớp
            if (oldPassword == null || !passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Mật khẩu cũ không chính xác!");
            }
        }

        // Lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }
}