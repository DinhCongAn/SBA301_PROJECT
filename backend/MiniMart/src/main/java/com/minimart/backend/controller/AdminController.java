package com.minimart.backend.controller;

import com.minimart.backend.repository.OrderRepository;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orderRepository.count());

        stats.put("totalRevenue", orderRepository.calculateTotalRevenue());
        stats.put("successfulOrders", orderRepository.countByStatus("DELIVERED"));

        return ResponseEntity.ok(stats);
    }
}