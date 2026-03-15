package com.minimart.backend.admin;

import com.minimart.backend.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin("*")
public class AdminController {

    // Tiêm (Inject) Service vào Controller
    @Autowired
    private AdminDashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            // Gọi 1 dòng duy nhất lấy toàn bộ dữ liệu thực tế từ DB
            Map<String, Object> realData = dashboardService.getDashboardData();
            return ResponseEntity.ok(realData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi truy xuất dữ liệu: " + e.getMessage());
        }
    }
}