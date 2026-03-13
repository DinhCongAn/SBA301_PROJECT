package com.minimart.backend.service;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import com.minimart.backend.entity.Product;
import com.minimart.backend.repository.ProductRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private ProductRepository productRepository;

    private Client geminiClient;

    // ==========================================
    // INIT GEMINI CLIENT (GIỐNG SERVICE 1)
    // ==========================================
    @PostConstruct
    public void initializeClient() {
        try {
            HttpOptions httpOptions = HttpOptions.builder()
                    .apiVersion("v1beta")
                    .build();

            this.geminiClient = Client.builder()
                    .apiKey(this.geminiApiKey)
                    .httpOptions(httpOptions)
                    .build();

            System.out.println("✅ Gemini AI MiniMart đã sẵn sàng");

        } catch (Exception e) {
            System.err.println("❌ Lỗi khởi tạo Gemini Client: " + e.getMessage());
        }
    }

    // ==========================================
    // MAIN METHOD
    // ==========================================
    public String getShoppingAdvice(String userMessage) {

        if (geminiClient == null) {
            return "AI đang khởi động… đợi xíu nha 😎";
        }

        // 1. Lấy sản phẩm từ database
        List<Product> availableProducts = productRepository.findAll();

        String productListText = availableProducts.stream()
                .filter(p -> "active".equals(p.getStatus()))
                .map(p -> "- " + p.getName() + " (Giá: " + p.getPrice() + "đ)")
                .collect(Collectors.joining("\n"));

        // 2. Prompt cho AI
        String prompt =
                "Bạn là trợ lý ảo thân thiện của siêu thị MiniMart.\n\n" +

                        "Dưới đây là danh sách sản phẩm đang bán:\n" +
                        productListText + "\n\n" +

                        "Khách hàng hỏi: \"" + userMessage + "\"\n\n" +

                        "Nhiệm vụ của bạn:\n" +
                        "- Tư vấn món ăn hoặc sản phẩm phù hợp.\n" +
                        "- Chỉ được đề xuất sản phẩm TRONG danh sách trên.\n" +
                        "- Trả lời ngắn gọn, lịch sự.\n" +
                        "- Có thể tính tổng tiền ước tính nếu cần.\n" +
                        "- Trả lời bằng Tiếng Việt.";

        // 3. Gọi Gemini AI
        try {

            String aiResponse = geminiClient.models
                    .generateContent("gemini-2.5-flash", prompt, null)
                    .text();

            return aiResponse;

        } catch (Exception e) {

            System.err.println("Lỗi gọi Gemini API: " + e.getMessage());

            return "Xin lỗi, hiện tại hệ thống tư vấn AI đang bận. "
                    + "Bạn có thể tự tìm sản phẩm trên thanh công cụ nhé!";
        }
    }
}