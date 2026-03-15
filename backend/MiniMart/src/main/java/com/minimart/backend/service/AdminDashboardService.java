package com.minimart.backend.service;

import com.minimart.backend.entity.Order;
import com.minimart.backend.entity.Product;
import com.minimart.backend.repository.OrderItemRepository;
import com.minimart.backend.repository.OrderRepository;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AdminDashboardService {

    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;

    public Map<String, Object> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        // ==========================================
        // 1. DỮ LIỆU 4 THẺ THỐNG KÊ (STATS)
        // ==========================================
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("userTrend", "+Mới"); // Để tính trend thật cần có cột createdAt, tạm dùng text
        stats.put("userTrendUp", true);

        stats.put("totalProducts", productRepository.count());
        stats.put("productTrend", "+Mới");
        stats.put("productTrendUp", true);

        stats.put("totalOrders", orderRepository.count());
        stats.put("orderTrend", "Ổn định");
        stats.put("orderTrendUp", true);

        stats.put("totalRevenue", orderRepository.calculateTotalRevenue());
        stats.put("revenueTrend", "Tăng");
        stats.put("revenueTrendUp", true);

        response.put("stats", stats);


        // ==========================================
        // 2. BIỂU ĐỒ DOANH THU 7 NGÀY QUA
        // ==========================================
        Double[] weeklyRevenue = new Double[]{0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0};
        Instant sevenDaysAgo = Instant.now().minus(6, ChronoUnit.DAYS);

        List<Order> recentDeliveredOrders = orderRepository.findDeliveredOrdersSince(sevenDaysAgo);

        LocalDate today = LocalDate.now();
        for (Order order : recentDeliveredOrders) {
            LocalDate orderDate = order.getOrderDate().atZone(ZoneId.systemDefault()).toLocalDate();
            int daysAgo = (int) ChronoUnit.DAYS.between(orderDate, today);
            if (daysAgo >= 0 && daysAgo <= 6) {
                // daysAgo = 0 là hôm nay (index 6), daysAgo = 6 là 6 ngày trước (index 0)
                int index = 6 - daysAgo;
                weeklyRevenue[index] += order.getTotalAmount();
            }
        }
        response.put("weeklyRevenue", Arrays.asList(weeklyRevenue));


        // ==========================================
        // 3. DANH SÁCH 5 ĐƠN HÀNG MỚI NHẤT
        // ==========================================
        List<Order> latestOrders = orderRepository.findTop5ByOrderByOrderDateDesc();
        List<Map<String, Object>> recentOrdersList = new ArrayList<>();
        for (Order o : latestOrders) {
            Map<String, Object> map = new HashMap<>();
            map.put("orderCode", o.getOrderCode());
            map.put("customer", o.getUser() != null ? o.getUser().getFullName() : "Khách vãng lai");
            map.put("total", o.getTotalAmount());
            map.put("status", o.getStatus());
            recentOrdersList.add(map);
        }
        response.put("recentOrders", recentOrdersList);


        // ==========================================
        // 4. TOP 3 SẢN PHẨM BÁN CHẠY NHẤT
        // ==========================================
        // Lấy 3 dòng đầu tiên từ câu lệnh SQL Group By
        List<Object[]> topSellingData = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 3));
        List<Map<String, Object>> topProductsList = new ArrayList<>();

        for (Object[] row : topSellingData) {
            Product product = (Product) row[0];
            Long totalSold = (Long) row[1];

            Map<String, Object> map = new HashMap<>();
            map.put("name", product.getName());
            map.put("price", product.getPrice());
            map.put("image", product.getThumbnailUrl());
            map.put("sold", totalSold);
            topProductsList.add(map);
        }
        response.put("topProducts", topProductsList);


        return response;
    }
}