package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.Order;
import com.minimart.backend.repository.OrderRepository;
import com.minimart.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin("*")
public class AdminOrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private EmailService emailService;

    // 1. Lấy danh sách kèm Lọc & Phân trang
    @GetMapping
    public ResponseEntity<Page<Order>> getOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String status,
            @RequestParam(defaultValue = "ALL") String paymentMethod,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "orderDate"));

        Instant start = null;
        Instant end = null;

        if (startDate != null && !startDate.isEmpty()) {
            start = LocalDate.parse(startDate).atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        }

        if (endDate != null && !endDate.isEmpty()) {
            end = LocalDate.parse(endDate).atTime(LocalTime.MAX).atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toInstant();
        }

        return ResponseEntity.ok(orderRepository.findAdminOrders(search, status, paymentMethod, start, end, pageable));
    }

    // 2. Cập nhật Trạng thái & Gửi Mail
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng!");

        Order order = orderOpt.get();
        order.setStatus(newStatus);
        orderRepository.save(order);

        String toEmail = (order.getUser() != null) ? order.getUser().getEmail() : null;
        String customerName = (order.getUser() != null && order.getUser().getFullName() != null)
                ? order.getUser().getFullName() : "Khách hàng";
        String orderCode = order.getOrderCode();

        if (toEmail != null && !toEmail.isEmpty()) {
            emailService.sendOrderStatusEmail(toEmail, orderCode, customerName, newStatus);
        } else {
            System.out.println("⚠️ Đơn hàng " + orderCode + " không có Email, bỏ qua.");
        }

        return ResponseEntity.ok("Cập nhật trạng thái thành công!");
    }
}