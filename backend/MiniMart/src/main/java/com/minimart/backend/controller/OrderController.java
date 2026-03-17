package com.minimart.backend.controller;

import com.minimart.backend.entity.Order;
import com.minimart.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // 1. KIỂM TRA MÃ KHUYẾN MÃI
    @PostMapping("/apply-promo")
    public ResponseEntity<?> applyPromo(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            Double currentTotal = Double.valueOf(request.get("total").toString());

            Map<String, Object> result = orderService.applyPromo(code, currentTotal);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. CHỐT ĐƠN HÀNG
    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> request) {
        try {
            Order order = orderService.placeOrder(request);
            return ResponseEntity.ok(Collections.singletonMap("message", "Đặt hàng thành công! Mã đơn: " + order.getOrderCode()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (ADMIN)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getUserOrders(userId));
    }

    // 5. LẤY CHI TIẾT CÁC MÓN TRONG 1 ĐƠN HÀNG
    @GetMapping("/{orderId}/items")
    public ResponseEntity<?> getOrderItems(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }

    // 6. KHÁCH HÀNG TỰ HỦY ĐƠN HÀNG
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestParam Long userId) {
        try {
            orderService.cancelOrder(orderId, userId);
            return ResponseEntity.ok("Hủy đơn hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}