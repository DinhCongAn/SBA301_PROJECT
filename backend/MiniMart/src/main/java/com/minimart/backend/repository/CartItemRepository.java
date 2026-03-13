package com.minimart.backend.repository;

import com.minimart.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 1. Lấy toàn bộ danh sách sản phẩm đang có trong giỏ hàng của 1 user
    List<CartItem> findByUser_UserId(Long userId);

    // 2. Tìm một sản phẩm cụ thể trong giỏ hàng của 1 user
    // (Dùng để kiểm tra xem sản phẩm đã có trong giỏ chưa. Nếu có rồi thì chỉ cộng dồn số lượng)
    Optional<CartItem> findByUser_UserIdAndProduct_ProductId(Long userId, Long productId);

    // 3. Xóa toàn bộ giỏ hàng của 1 user
    // (Chuẩn bị sẵn hàm này để sau này khi khách hàng "Thanh toán thành công" thì gọi hàm này để làm trống giỏ)
    void deleteByUser_UserId(Long userId);
}