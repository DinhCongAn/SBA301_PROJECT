package com.minimart.backend.controller;

import com.minimart.backend.entity.Product;
import com.minimart.backend.entity.ProductReview;
import com.minimart.backend.entity.User;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.repository.ReviewRepository;
import com.minimart.backend.repository.UserRepository;
import com.minimart.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public Page<Product> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size
    ) {
        if (search != null && search.trim().isEmpty()) search = null;

        // Xử lý logic Sắp xếp (Sort)
        Sort sortObj = Sort.by(Sort.Direction.DESC, "product_id");
        if ("price_asc".equals(sort)) {
            sortObj = Sort.by(Sort.Direction.ASC, "price"); // Giá thấp đến cao
        } else if ("price_desc".equals(sort)) {
            sortObj = Sort.by(Sort.Direction.DESC, "price"); // Giá cao đến thấp
        }

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return productRepository.searchAndFilterProducts(search, category, minPrice, maxPrice, pageable);
    }

    //Lấy chi tiết 1 sản phẩm theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if(product.isPresent()) {
            return ResponseEntity.ok(product.get());
        }
        return ResponseEntity.notFound().build();
    }

    //Gọi AI Tóm tắt bình luận của sản phẩm này
    @GetMapping("/{id}/ai-summary")
    public ResponseEntity<?> getAiReviewSummary(@PathVariable Long id) {
        String summary = aiService.summarizeReviews(id);
        return ResponseEntity.ok(Collections.singletonMap("summary", summary));
    }

    //Lấy danh sách bình luận của 1 sản phẩm
    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getProductReviews(@PathVariable Long id) {
        List<ProductReview> reviews = reviewRepository.findByProduct_ProductId(id);
        return ResponseEntity.ok(reviews);
    }

    // Viết bình luận mới (Hoặc Cập nhật nếu đã đánh giá)
    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody ProductReview reviewReq) {
        Long userId = reviewReq.getUser().getUserId();

        Optional<Product> productOpt = productRepository.findById(id);
        Optional<User> userOpt = userRepository.findById(userId);

        if (productOpt.isPresent() && userOpt.isPresent()) {

            // KIỂM TRA: Tìm xem người này đã đánh giá sản phẩm này bao giờ chưa?
            Optional<ProductReview> existingReview = reviewRepository.findByProduct_ProductIdAndUser_UserId(id, userId);

            if (existingReview.isPresent()) {
                // TRƯỜNG HỢP 1: ĐÃ ĐÁNH GIÁ RỒI -> TIẾN HÀNH GHI ĐÈ (UPDATE)
                ProductReview reviewToUpdate = existingReview.get();
                reviewToUpdate.setRating(reviewReq.getRating());
                reviewToUpdate.setComment(reviewReq.getComment());
                // (Không cần set lại product và user nữa vì nó vẫn là cái cũ)

                reviewRepository.save(reviewToUpdate);
                return ResponseEntity.ok("Đã cập nhật lại đánh giá của bạn!");
            } else {
                // TRƯỜNG HỢP 2: CHƯA ĐÁNH GIÁ BAO GIỜ -> TẠO MỚI
                ProductReview newReview = new ProductReview();
                newReview.setProduct(productOpt.get());
                newReview.setUser(userOpt.get());
                newReview.setRating(reviewReq.getRating());
                newReview.setComment(reviewReq.getComment());

                reviewRepository.save(newReview);
                return ResponseEntity.ok("Cảm ơn bạn đã đánh giá sản phẩm!");
            }
        }

        return ResponseEntity.badRequest().body("Lỗi: Không tìm thấy sản phẩm hoặc người dùng.");
    }

    // Thêm vào Controller chứa API chi tiết sản phẩm của bạn
    @GetMapping("/{id}/similar")
    public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable Long id) {
        // 1. Tìm sản phẩm hiện tại đang xem
        Optional<Product> currentProductOpt = productRepository.findById(id);

        if (currentProductOpt.isPresent() && currentProductOpt.get().getCategory() != null) {
            // 2. Lấy ID danh mục của nó
            Long categoryId = currentProductOpt.get().getCategory().getCategoryId();

            // 3. Gọi hàm lấy 4 sản phẩm ngẫu nhiên cùng danh mục
            List<Product> similarProducts = productRepository.findSimilarProducts(categoryId, id);
            return ResponseEntity.ok(similarProducts);
        }

        // Nếu lỗi hoặc sản phẩm ko có danh mục, trả về mảng rỗng
        return ResponseEntity.ok(List.of());
    }
}

