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

}