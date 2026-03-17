package com.minimart.backend.service;

import com.minimart.backend.dto.OrderNotification;
import com.minimart.backend.dto.UserNotification;
import com.minimart.backend.entity.*;
import com.minimart.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private PromotionRepository promotionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private EmailService emailService;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    // 1. XỬ LÝ MÃ KHUYẾN MÃI
    public Map<String, Object> applyPromo(String code, Double currentTotal) {
        Promotion promo = promotionRepository.findByCodeAndIsActiveTrue(code)
                .orElseThrow(() -> new IllegalArgumentException("Mã giảm giá không hợp lệ hoặc đã hết hạn!"));

        if (promo.getUsageLimit() != null && promo.getUsageLimit() > 0) {
            int used = promo.getUsedCount() != null ? promo.getUsedCount() : 0;
            if (used >= promo.getUsageLimit()) {
                throw new IllegalArgumentException("Rất tiếc! Mã giảm giá này đã hết lượt sử dụng.");
            }
        }

        Double minOrder = promo.getMinOrderAmount() != null ? ((Number) promo.getMinOrderAmount()).doubleValue() : 0.0;
        if (minOrder > 0 && currentTotal < minOrder) {
            throw new IllegalArgumentException("Đơn hàng phải từ " + minOrder + "đ mới được áp dụng mã này.");
        }

        Double discountAmount = 0.0;
        Double discountValue = ((Number) promo.getDiscountValue()).doubleValue();
        String discountType = promo.getDiscountType().trim().toUpperCase();

        if ("FIXED".equals(discountType) || "FIXED_AMOUNT".equals(discountType)) {
            discountAmount = discountValue;
        } else if ("PERCENTAGE".equals(discountType)) {
            discountAmount = currentTotal * (discountValue / 100.0);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("discount", discountAmount);
        res.put("message", "Áp dụng mã thành công!");
        return res;
    }

    // 2. CHỐT ĐƠN HÀNG (Có Transactional bảo vệ DB)
    @Transactional(rollbackFor = Exception.class)
    public Order placeOrder(Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String addressSnapshot = (String) request.get("addressSnapshot");
        String paymentMethod = (String) request.get("paymentMethod");
        Double finalTotal = Double.valueOf(request.get("finalTotal").toString());
        String promoCode = (String) request.get("promoCode");

        List<CartItem> cartItems = cartItemRepository.findByUser_UserId(userId);
        if (cartItems.isEmpty()) throw new IllegalArgumentException("Giỏ hàng đang trống!");

        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user"));

        // Tạo Đơn hàng
        Order order = new Order();
        order.setUser(user);
        order.setOrderCode("ORD-" + System.currentTimeMillis());
        order.setShippingAddress(addressSnapshot);
        order.setPaymentMethod(paymentMethod);
        order.setTotalAmount(finalTotal);
        order.setStatus("PENDING");
        order = orderRepository.save(order);

        // Chuyển CartItem thành OrderItem & TRỪ TỒN KHO
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if(product.getStockQuantity() < item.getQuantity()){
                throw new IllegalArgumentException("Sản phẩm " + product.getName() + " không đủ số lượng!");
            }

            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice().doubleValue());
            orderItemRepository.save(orderItem);
        }

        // Làm sạch giỏ hàng
        cartItemRepository.deleteAll(cartItems);

        // Tăng lượt dùng mã
        if (promoCode != null && !promoCode.trim().isEmpty()) {
            promotionRepository.findByCodeAndIsActiveTrue(promoCode).ifPresent(appliedPromo -> {
                int currentUsed = appliedPromo.getUsedCount() != null ? appliedPromo.getUsedCount() : 0;
                appliedPromo.setUsedCount(currentUsed + 1);
                promotionRepository.save(appliedPromo);
            });
        }

        // Gửi Email
        try {
            emailService.sendOrderConfirmationEmail(user.getEmail(), order, user.getFullName());
        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
        }

        // BẮN THÔNG BÁO WEBSOCKET CHO ADMIN
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
            String formattedTime = formatter.format(order.getOrderDate()); // Entity Order của bạn dùng Instant
            OrderNotification notification = new OrderNotification(order.getId(), order.getOrderCode(), user.getFullName(), order.getTotalAmount(), formattedTime);
            messagingTemplate.convertAndSend("/topic/new-order", notification);
        } catch (Exception e) {
            System.err.println("Lỗi bắn thông báo WebSocket: " + e.getMessage());
        }

        return order;
    }

    // 3. CẬP NHẬT TRẠNG THÁI (ADMIN)
    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));

        order.setStatus(newStatus.toUpperCase());
        orderRepository.save(order);

        // 1. Bắn email như cũ
        try {
            emailService.sendOrderStatusUpdateEmail(order.getUser().getEmail(), order, order.getUser().getFullName());
        } catch (Exception e) {
            System.err.println("Lỗi gửi email cập nhật trạng thái: " + e.getMessage());
        }

        // 2. TÍNH NĂNG MỚI: BẮN THÔNG BÁO WEBSOCKET ĐẾN ĐÚNG USER ĐÓ
        try {
            String statusText = "";
            if (newStatus.equalsIgnoreCase("PROCESSING")) statusText = "đang được chuẩn bị";
            else if (newStatus.equalsIgnoreCase("DELIVERING")) statusText = "đang được giao đến bạn";
            else if (newStatus.equalsIgnoreCase("DELIVERED")) statusText = "đã giao thành công";
            else if (newStatus.equalsIgnoreCase("CANCELLED")) statusText = "đã bị hủy";

            // 👉 SỬ DỤNG CLASS DTO CHUẨN ĐỂ SPRING BOOT KHÔNG THỂ NUỐT TIN NHẮN
            UserNotification notiData = new UserNotification(
                    order.getId(),
                    order.getOrderCode(),
                    "Đơn hàng #" + order.getOrderCode() + " của bạn " + statusText + ".",
                    System.currentTimeMillis()
            );

            messagingTemplate.convertAndSend("/topic/user/" + order.getUser().getUserId() + "/notifications", notiData);

            System.out.println("✅ Đã bắn thông báo cho khách hàng ID: " + order.getUser().getUserId());
        } catch (Exception e) {
            System.err.println("❌ Lỗi bắn thông báo cho Khách hàng: " + e.getMessage());
        }

        return order;
    }

    // 4. LẤY DANH SÁCH ĐƠN HÀNG THEO USER
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUser_UserIdOrderByOrderDateDesc(userId);
    }

    // 5. LẤY CHI TIẾT CÁC MÓN TRONG ĐƠN
    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrder_Id(orderId);
    }

    // 6. KHÁCH TỰ HỦY ĐƠN
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng."));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền hủy đơn hàng này.");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalArgumentException("Bạn chỉ có thể hủy khi đơn hàng đang ở trạng thái Chờ xác nhận.");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // Hoàn kho
        List<OrderItem> items = orderItemRepository.findByOrder_Id(orderId);
        for (OrderItem item : items) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        try {
            if (emailService != null) {
                emailService.sendOrderStatusUpdateEmail(order.getUser().getEmail(), order, order.getUser().getFullName());
            }
        } catch (Exception e) {
            System.err.println("Lỗi gửi email báo hủy đơn: " + e.getMessage());
        }
    }
}