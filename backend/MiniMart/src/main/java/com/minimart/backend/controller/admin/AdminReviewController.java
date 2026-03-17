package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.ProductReview;
import com.minimart.backend.repository.ProductReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reviews")
public class AdminReviewController {

    @Autowired
    private ProductReviewRepository reviewRepository;

    // 1. API Lấy danh sách đánh giá (Có phân trang & Lọc)
    @GetMapping
    public ResponseEntity<Map<String, Object>> getReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer rating) {

        // Sắp xếp các đánh giá mới nhất lên đầu
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());

        // Chống lỗi chuỗi rỗng
        if (search != null && search.trim().isEmpty()) {
            search = null;
        }

        // Gọi Repository để lấy dữ liệu
        Page<ProductReview> reviewPage = reviewRepository.findByAdminFilters(search, rating, pageable);

        // Map dữ liệu Entity sang dạng DTO cho Frontend dễ đọc
        List<Map<String, Object>> content = reviewPage.getContent().stream().map(review -> {
            Map<String, Object> map = new HashMap<>();

            map.put("id", review.getId());

            // Lấy tên User và Product (Đề phòng trường hợp User/Product đã bị xóa)
            map.put("userName", review.getUser() != null ? review.getUser().getFullName() : "Khách ẩn danh");
            map.put("productName", review.getProduct() != null ? review.getProduct().getName() : "Sản phẩm đã xóa");
            map.put("rating", review.getRating());
            map.put("comment", review.getComment());
            map.put("createdAt", review.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        // Đóng gói JSON trả về cho React
        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("totalPages", reviewPage.getTotalPages());
        response.put("totalElements", reviewPage.getTotalElements());

        return ResponseEntity.ok(response);
    }

    // 2. API Xóa đánh giá
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Đã xóa đánh giá thành công!"));
        }
        return ResponseEntity.notFound().build();
    }
}