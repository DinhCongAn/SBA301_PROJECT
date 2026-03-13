package com.minimart.backend.repository;

import com.minimart.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Lấy ra tất cả các sản phẩm nằm trong một đơn hàng cụ thể
    List<OrderItem> findByOrder_Id(Long orderId);

}
