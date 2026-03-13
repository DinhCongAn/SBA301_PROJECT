package com.minimart.backend.repository;

import com.minimart.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Lấy toàn bộ đơn hàng của 1 user, sắp xếp ngày đặt mới nhất lên đầu
    List<Order> findByUser_UserIdOrderByOrderDateDesc(Long userId);

    // Tìm một đơn hàng cụ thể thông qua mã đơn (Ví dụ: tìm ORD-1704253)
    Optional<Order> findByOrderCode(String orderCode);

    // TÍNH TỔNG DOANH THU CỦA CÁC ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG
    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();

    // ĐẾM SỐ LƯỢNG ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG (Tùy chọn thêm)
    long countByStatus(String status);
}