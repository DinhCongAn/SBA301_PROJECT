package com.minimart.backend.controller;

import com.minimart.backend.entity.CartItem;
import com.minimart.backend.entity.Product;
import com.minimart.backend.entity.User;
import com.minimart.backend.repository.CartItemRepository;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.repository.UserRepository;
import com.minimart.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired private CartItemRepository cartRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private AIService aiService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartRepository.findByUser_UserId(userId));
    }

    // 1. API THÊM VÀO GIỎ HÀNG (CỘNG DỒN SỐ LƯỢNG)
    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToCart(@PathVariable Long userId, @RequestBody Map<String, Integer> request) {
        Long productId = Long.valueOf(request.get("productId"));
        Integer quantity = request.get("quantity");

        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Product> prodOpt = productRepository.findById(productId);

        if (userOpt.isPresent() && prodOpt.isPresent()) {
            Product product = prodOpt.get();
            Optional<CartItem> existingItem = cartRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);

            CartItem cartItem;
            if (existingItem.isPresent()) {
                cartItem = existingItem.get();
                // Cộng dồn số lượng cũ và mới
                int newQuantity = cartItem.getQuantity() + quantity;
                if (product.getStockQuantity() < newQuantity) {
                    return ResponseEntity.badRequest().body("Tổng số lượng trong giỏ vượt quá tồn kho!");
                }
                cartItem.setQuantity(newQuantity);
            } else {
                if (product.getStockQuantity() < quantity) {
                    return ResponseEntity.badRequest().body("Số lượng vượt quá tồn kho!");
                }
                cartItem = new CartItem();
                cartItem.setUser(userOpt.get());
                cartItem.setProduct(product);
                cartItem.setQuantity(quantity);
            }
            return ResponseEntity.ok(cartRepository.save(cartItem));
        }
        return ResponseEntity.badRequest().body("Lỗi dữ liệu");
    }

    // 2. API CẬP NHẬT SỐ LƯỢNG TRONG GIỎ (GHI ĐÈ)
    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updateCart(@PathVariable Long userId, @RequestBody Map<String, Integer> request) {
        Long productId = Long.valueOf(request.get("productId"));
        Integer quantity = request.get("quantity");

        Optional<CartItem> existingItem = cartRepository.findByUser_UserIdAndProduct_ProductId(userId, productId);
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            // Cập nhật chính xác con số người dùng bấm (+/-)
            cartItem.setQuantity(quantity);
            return ResponseEntity.ok(cartRepository.save(cartItem));
        }
        return ResponseEntity.badRequest().body("Không tìm thấy sản phẩm trong giỏ");
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long cartItemId) {
        cartRepository.deleteById(cartItemId);
        return ResponseEntity.ok("Đã xóa khỏi giỏ hàng");
    }

    @PostMapping("/ai-chef")
    public ResponseEntity<?> callAiChef(@RequestBody List<String> productNames) {
        String recipe = aiService.suggestRecipeFromCart(productNames);
        return ResponseEntity.ok(Collections.singletonMap("recipe", recipe));
    }
}