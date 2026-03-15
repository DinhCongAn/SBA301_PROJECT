package com.minimart.backend.repository;

import com.minimart.backend.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Lấy ra tất cả các sản phẩm nằm trong một đơn hàng cụ thể
    List<OrderItem> findByOrder_Id(Long orderId);

    // Tìm sản phẩm bán chạy nhất (Group by Product và tính tổng Quantity)
    @Query("SELECT oi.product, SUM(oi.quantity) as totalSold " +
            "FROM OrderItem oi JOIN oi.order o " +
            "WHERE o.status = 'DELIVERED' " +
            "GROUP BY oi.product " +
            "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingProducts(Pageable pageable);
}
