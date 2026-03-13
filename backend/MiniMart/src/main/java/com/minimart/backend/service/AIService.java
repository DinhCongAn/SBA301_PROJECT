package com.minimart.backend.service;

import com.minimart.backend.entity.Product;
import com.minimart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private ProductRepository productRepository;

    public String getShoppingAdvice(String userMessage) {
        // 1. Lấy tất cả sản phẩm đang bán từ Database làm ngữ cảnh
        List<Product> availableProducts = productRepository.findAll();
        String productListText = availableProducts.stream()
                .filter(p -> "active".equals(p.getStatus()))
                .map(p -> "- " + p.getName() + " (Giá: " + p.getPrice() + "đ)")
                .collect(Collectors.joining("\n"));

        // 2. Xây dựng Prompt (Lệnh) cho AI
        String prompt = "Bạn là trợ lý ảo thân thiện của siêu thị MiniMart. " +
                "Dưới đây là danh sách các sản phẩm siêu thị đang bán:\n" +
                productListText + "\n\n" +
                "Khách hàng hỏi: \"" + userMessage + "\"\n" +
                "Hãy tư vấn món ăn và đề xuất chính xác các sản phẩm TRONG DANH SÁCH TRÊN. " +
                "Trả lời ngắn gọn, lịch sự, có tính toán tổng tiền ước tính nếu cần.";

        // 3. Gọi API của Google Gemini
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build body theo chuẩn của Gemini API
        String requestBody = "{\n" +
                "  \"contents\": [{\n" +
                "    \"parts\":[{\"text\": \"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\"}]\n" +
                "  }]\n" +
                "}";

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            // Bóc tách JSON trả về để lấy câu trả lời
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            System.err.println("Lỗi gọi Gemini API: " + e.getMessage());
            return "Xin lỗi, hiện tại hệ thống tư vấn AI đang bận. Bạn có thể tự tìm sản phẩm trên thanh công cụ nhé!";
        }
    }
}