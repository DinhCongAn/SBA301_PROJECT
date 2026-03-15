package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.User;
import com.minimart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("*")
public class AdminUserController {

    @Autowired private UserRepository userRepository;

    // 1. Lấy danh sách Người dùng có Phân trang & Tìm kiếm
    @GetMapping
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "userId"));
        return ResponseEntity.ok(userRepository.findWithFilters(search, pageable));
    }

    // 2. Thay đổi quyền (Role)
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy người dùng!");

        User user = userOpt.get();
        user.setRole(body.get("role").toUpperCase()); // Ép kiểu ADMIN hoặc USER
        userRepository.save(user);
        return ResponseEntity.ok("Cập nhật quyền thành công!");
    }

    // 3. Khóa/Mở khóa Tài khoản (Toggle Active)
    @PutMapping("/{id}/toggle-lock")
    public ResponseEntity<?> toggleUserLock(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy người dùng!");

        User user = userOpt.get();
        // Đảo ngược trạng thái (Đang true thành false, đang false thành true)
        user.setIsActive(user.getIsActive() != null ? !user.getIsActive() : false);
        userRepository.save(user);

        String msg = user.getIsActive() ? "Đã MỞ KHÓA tài khoản!" : "Đã KHÓA tài khoản!";
        return ResponseEntity.ok(msg);
    }
}