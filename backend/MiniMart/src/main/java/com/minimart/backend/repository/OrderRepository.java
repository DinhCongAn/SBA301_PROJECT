package com.minimart.backend.repository;

import com.minimart.backend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Lấy toàn bộ đơn hàng của 1 user, sắp xếp ngày đặt mới nhất lên đầu
    List<Order> findByUser_UserIdOrderByOrderDateDesc(Long userId);

    // Tìm một đơn hàng cụ thể thông qua mã đơn (Ví dụ: tìm ORD-1704253)
    Optional<Order> findByOrderCode(String orderCode);

    // ĐẾM SỐ LƯỢNG ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG (Tùy chọn thêm)
    long countByStatus(String status);

    // 1. Lấy 5 đơn hàng mới nhất
    List<Order> findTop5ByOrderByOrderDateDesc();

    // 2. Tính tổng doanh thu của các đơn đã giao
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status = 'DELIVERED'")
    Double calculateTotalRevenue();

    // 3. Lấy các đơn hàng trong 7 ngày qua để vẽ biểu đồ
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :startDate AND o.status = 'DELIVERED'")
    List<Order> findDeliveredOrdersSince(Instant startDate);

    @Query("SELECT o FROM Order o JOIN o.user u WHERE " +
            "(:search IS NULL OR o.orderCode LIKE %:search% OR u.fullName LIKE %:search%) AND " +
            "(:status IS NULL OR :status = '' OR :status = 'ALL' OR o.status = :status) AND " +
            "(:paymentMethod IS NULL OR :paymentMethod = '' OR :paymentMethod = 'ALL' OR o.paymentMethod = :paymentMethod) AND " +
            "(cast(:startDate as timestamp) IS NULL OR o.orderDate >= :startDate) AND " +
            "(cast(:endDate as timestamp) IS NULL OR o.orderDate <= :endDate)")
    Page<Order> findAdminOrders(
            @Param("search") String search,
            @Param("status") String status,
            @Param("paymentMethod") String paymentMethod,
            @Param("startDate") java.time.Instant startDate,
            @Param("endDate") java.time.Instant endDate,
            Pageable pageable);


}