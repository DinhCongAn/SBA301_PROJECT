package com.minimart.backend.repository;

import com.minimart.backend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ProductReview, Long> {
    // Lấy toàn bộ đánh giá của một sản phẩm
    List<ProductReview> findByProduct_ProductId(Long productId);
    Optional<ProductReview> findByProduct_ProductIdAndUser_UserId(Long productId, Long userId);
}