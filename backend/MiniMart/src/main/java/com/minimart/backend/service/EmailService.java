package com.minimart.backend.service;

import com.minimart.backend.entity.Order;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // 1. GỬI MAIL KHI ĐẶT HÀNG THÀNH CÔNG
    @Async // Chạy ngầm, không làm đơ web
    public void sendOrderConfirmationEmail(String toEmail, Order order, String customerName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🎉 Đặt hàng thành công tại MiniMart - Mã đơn: " + order.getOrderCode());

            String moneyFormat = NumberFormat.getCurrencyInstance(new Locale("vi", "VN")).format(order.getTotalAmount());

            // Thiết kế giao diện Email bằng HTML
            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;'>"
                    + "<h2 style='color: #10b981; text-align: center;'>Cảm ơn bạn đã mua sắm tại MiniMart!</h2>"
                    + "<p>Xin chào <b>" + customerName + "</b>,</p>"
                    + "<p>Đơn hàng <b>" + order.getOrderCode() + "</b> của bạn đã được hệ thống ghi nhận và đang chờ xử lý.</p>"
                    + "<div style='background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;'>"
                    + "<p><b>Tổng thanh toán:</b> <span style='color: #10b981; font-size: 18px; font-weight: bold;'>" + moneyFormat + "</span></p>"
                    + "<p><b>Phương thức:</b> " + order.getPaymentMethod() + "</p>"
                    + "<p><b>Giao đến:</b> " + order.getShippingAddress() + "</p>"
                    + "</div>"
                    + "<p>Chúng tôi sẽ thông báo cho bạn ngay khi đơn hàng bắt đầu được giao.</p>"
                    + "<br><p>Trân trọng,<br><b>Đội ngũ MiniMart</b></p>"
                    + "</div>";

            helper.setText(htmlContent, true); // true = Bật chế độ HTML
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Lỗi gửi mail xác nhận đơn hàng: " + e.getMessage());
        }
    }

    // 2. GỬI MAIL KHI ADMIN THAY ĐỔI TRẠNG THÁI ĐƠN HÀNG
    @Async
    public void sendOrderStatusUpdateEmail(String toEmail, Order order, String customerName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("📦 Cập nhật trạng thái đơn hàng: " + order.getOrderCode());

            // Chuyển đổi trạng thái tiếng Anh sang Tiếng Việt cho đẹp
            String statusText = "";
            String color = "#3b82f6"; // Mặc định xanh dương
            switch (order.getStatus()) {
                case "PROCESSING": statusText = "Đang được chuẩn bị"; color = "#f59e0b"; break;
                case "DELIVERING": statusText = "Đang giao đến bạn"; color = "#3b82f6"; break;
                case "DELIVERED": statusText = "Đã giao thành công"; color = "#10b981"; break;
                case "CANCELLED": statusText = "Đã bị hủy"; color = "#ef4444"; break;
                default: statusText = order.getStatus();
            }

            String htmlContent = "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;'>"
                    + "<h2 style='color: " + color + "; text-align: center;'>Cập nhật Đơn hàng</h2>"
                    + "<p>Xin chào <b>" + customerName + "</b>,</p>"
                    + "<p>Trạng thái đơn hàng <b>" + order.getOrderCode() + "</b> của bạn vừa được cập nhật thành:</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<span style='background-color: " + color + "; color: white; padding: 10px 20px; border-radius: 50px; font-weight: bold; font-size: 16px;'>" + statusText + "</span>"
                    + "</div>"
                    + "<p>Bạn có thể theo dõi chi tiết trong phần 'Đơn hàng của tôi' trên ứng dụng.</p>"
                    + "<br><p>Trân trọng,<br><b>Đội ngũ MiniMart</b></p>"
                    + "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Lỗi gửi mail cập nhật trạng thái: " + e.getMessage());
        }
    }
}