package com.minimart.backend.controller;

import com.minimart.backend.entity.*;
import com.minimart.backend.repository.*;
import com.minimart.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private PromotionRepository promotionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private EmailService emailService;

    //KIỂM TRA MÃ KHUYẾN MÃI
    @PostMapping("/apply-promo")
    public ResponseEntity<?> applyPromo(@RequestBody Map<String, Object> request) {
        String code = (String) request.get("code");
        Double currentTotal = Double.valueOf(request.get("total").toString());

        Optional<Promotion> promoOpt = promotionRepository.findByCodeAndIsActiveTrue(code);
        if (!promoOpt.isPresent()) return ResponseEntity.badRequest().body("Mã giảm giá không hợp lệ hoặc đã hết hạn!");

        Promotion promo = promoOpt.get();

        // Ép kiểu an toàn (Phòng trường hợp minOrderAmount là null)
        Double minOrder = promo.getMinOrderAmount() != null ? ((Number) promo.getMinOrderAmount()).doubleValue() : 0.0;

        if (minOrder > 0 && currentTotal < minOrder) {
            return ResponseEntity.badRequest().body("Đơn hàng phải từ " + minOrder + "đ mới được áp dụng mã này.");
        }

        Double discountAmount = 0.0;
        Double discountValue = ((Number) promo.getDiscountValue()).doubleValue();

        // Loại bỏ khoảng trắng thừa nếu có
        String discountType = promo.getDiscountType().trim().toUpperCase();

        if ("FIXED".equals(discountType) || "FIXED_AMOUNT".equals(discountType)) {
            discountAmount = discountValue;
        } else if ("PERCENTAGE".equals(discountType)) {
            // Nếu là % thì lấy Tổng tiền * (Phần trăm / 100)
            discountAmount = currentTotal * (discountValue / 100.0);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("discount", discountAmount);
        res.put("message", "Áp dụng mã thành công!");
        return ResponseEntity.ok(res);
    }

    //CHỐT ĐƠN HÀNG (PLACE ORDER)
    @PostMapping("/place-order")
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String addressSnapshot = (String) request.get("addressSnapshot");
        String paymentMethod = (String) request.get("paymentMethod");
        Double finalTotal = Double.valueOf(request.get("finalTotal").toString());

        // Lấy giỏ hàng hiện tại
        List<CartItem> cartItems = cartItemRepository.findByUser_UserId(userId);
        if (cartItems.isEmpty()) return ResponseEntity.badRequest().body("Giỏ hàng đang trống!");

        User user = userRepository.findById(userId).get();

        // Tạo Đơn hàng
        Order order = new Order();
        order.setUser(user);
        order.setOrderCode("ORD-" + System.currentTimeMillis()); // Random mã đơn
        order.setShippingAddress(addressSnapshot);
        order.setPaymentMethod(paymentMethod);
        order.setTotalAmount(finalTotal);
        order.setStatus("PENDING");
        order = orderRepository.save(order);

        // Chuyển CartItem thành OrderItem & TRỪ TỒN KHO
        for (CartItem item : cartItems) {
            Product product = item.getProduct();

            // Check lại tồn kho phút chót (Tránh trường hợp 2 người mua cùng lúc)
            if(product.getStockQuantity() < item.getQuantity()){
                return ResponseEntity.badRequest().body("Sản phẩm " + product.getName() + " không đủ số lượng!");
            }

            // Trừ tồn kho
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            // Lưu chi tiết đơn
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice().doubleValue());
            orderItemRepository.save(orderItem);
        }

        // Làm sạch giỏ hàng
        for (CartItem item : cartItems) {
            cartItemRepository.delete(item);
        }
        // Gửi email xác nhận đơn hàng
        emailService.sendOrderConfirmationEmail(user.getEmail(), order, user.getFullName());
        return ResponseEntity.ok(Collections.singletonMap("message", "Đặt hàng thành công! Mã đơn: " + order.getOrderCode()));
    }

    //CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG(ADMIN)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status"); // PROCESSING, DELIVERING, DELIVERED, CANCELLED

        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus(newStatus.toUpperCase());
            orderRepository.save(order);

            // Gửi mail báo cho khách biết Admin vừa đổi trạng thái
            User user = order.getUser();
            emailService.sendOrderStatusUpdateEmail(user.getEmail(), order, user.getFullName());

            return ResponseEntity.ok("Cập nhật trạng thái thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng");
    }

    //LẤY DANH SÁCH ĐƠN HÀNG CỦA USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderRepository.findByUser_UserIdOrderByOrderDateDesc(userId));
    }

    //LẤY CHI TIẾT CÁC MÓN TRONG 1 ĐƠN HÀNG
    @GetMapping("/{orderId}/items")
    public ResponseEntity<?> getOrderItems(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderItemRepository.findByOrder_Id(orderId));
    }

    //KHÁCH HÀNG TỰ HỦY ĐƠN HÀNG (Chỉ khi PENDING)
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId, @RequestParam Long userId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (!orderOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng.");
        }

        Order order = orderOpt.get();

        // Bảo mật: Kiểm tra xem đơn này có đúng là của user đang request không
        if (!order.getUser().getUserId().equals(userId)) {
            return ResponseEntity.badRequest().body("Bạn không có quyền hủy đơn hàng này.");
        }

        // Logic: Chỉ cho phép hủy khi đang PENDING (Chờ xác nhận)
        if (!"PENDING".equals(order.getStatus())) {
            return ResponseEntity.badRequest().body("Bạn chỉ có thể hủy khi đơn hàng đang ở trạng thái Chờ xác nhận.");
        }

        // 1. Tiến hành hủy đơn
        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // 2. HOÀN LẠI SỐ LƯỢNG TỒN KHO VÀO DATABASE
        List<OrderItem> items = orderItemRepository.findByOrder_Id(orderId);
        for (OrderItem item : items) {
            Product product = item.getProduct();
            // Lấy tồn kho hiện tại + cộng lại số lượng khách vừa hủy
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        // 3. Gửi email thông báo hủy đơn thành công (Gọi anh Bưu tá)
        if (emailService != null) {
            emailService.sendOrderStatusUpdateEmail(order.getUser().getEmail(), order, order.getUser().getFullName());
        }

        return ResponseEntity.ok("Hủy đơn hàng thành công!");
    }
}