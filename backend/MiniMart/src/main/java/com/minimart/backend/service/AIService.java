package com.minimart.backend.service;

import com.google.genai.Client;
import com.google.genai.types.HttpOptions;
import com.minimart.backend.entity.Product;
import com.minimart.backend.entity.ProductReview;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.repository.ReviewRepository;
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
    @Autowired
    private ReviewRepository reviewRepository;

    private Client geminiClient;

    // ==========================================
    // INIT GEMINI CLIENT
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


    // Gợi ý mua hàng bằng AI
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

    // Tóm tắt bình luận của sản phẩm bằng AI
    public String summarizeReviews(Long productId) {
        if (geminiClient == null) return "Hệ thống AI đang bảo trì.";

        // 1. Kéo toàn bộ bình luận của sản phẩm này lên
        List<ProductReview> reviews = reviewRepository.findByProduct_ProductId(productId);

        if (reviews.isEmpty()) {
            return "Sản phẩm này chưa có đánh giá nào để AI tóm tắt.";
        }

        // 2. Nối tất cả bình luận thành 1 đoạn văn bản dài
        String allComments = reviews.stream()
                .filter(r -> r.getComment() != null && !r.getComment().trim().isEmpty())
                .map(r -> "- " + r.getComment())
                .collect(Collectors.joining("\n"));

        if (allComments.isEmpty()) return "Chưa có đánh giá dạng chữ để AI phân tích.";

        // 3. Ra lệnh (Prompt) cho Google Gemini
        String prompt = "Bạn là một chuyên gia phân tích dữ liệu mua sắm.\n" +
                "Dưới đây là các bình luận thực tế của khách hàng về 1 sản phẩm:\n" +
                allComments + "\n\n" +
                "Dựa vào các bình luận trên, hãy tóm tắt ngắn gọn lại thành 2 phần rõ ràng. " +
                "Không bịa đặt thêm thông tin ngoài bình luận. Trình bày chính xác theo format sau:\n" +
                "Ưu điểm chung:\n" +
                "- (Liệt kê các ưu điểm...)\n" +
                "Nhược điểm chung:\n" +
                "- (Liệt kê các nhược điểm...)";

        try {
            // Gọi AI xử lý
            return geminiClient.models.generateContent("gemini-2.5-flash", prompt, null).text();
        } catch (Exception e) {
            System.err.println("Lỗi AI Summarize: " + e.getMessage());
            return "Hệ thống tóm tắt AI đang bận. Vui lòng thử lại sau.";
        }
    }

    //AI CHEF - GỢI Ý MÓN ĂN TỪ GIỎ HÀNG
    public String suggestRecipeFromCart(List<String> ingredients) {
        if (geminiClient == null) return "Hệ thống AI đang bảo trì.";
        if (ingredients == null || ingredients.isEmpty()) return "Giỏ hàng của bạn đang trống.";

        String items = String.join(", ", ingredients);
        String prompt = "Tôi đang ở siêu thị và trong giỏ hàng của tôi có các nguyên liệu sau: [" + items + "]. " +
                "Hãy đóng vai một siêu đầu bếp nhà hàng 5 sao. Dựa vào TẤT CẢ hoặc MỘT VÀI nguyên liệu chính ở trên (có thể giả định tôi đã có sẵn các gia vị cơ bản như mắm, muối, tiêu, hành tỏi ở nhà), " +
                "hãy gợi ý cho tôi 1 công thức nấu ăn xuất sắc nhất.\n\n" +
                "Trình bày format ngắn gọn, hấp dẫn gồm 3 phần:\n" +
                "🍲 Tên món ăn:\n" +
                "🛒 Nguyên liệu cần dùng:\n" +
                "👨‍🍳 Cách làm (3-4 bước ngắn gọn):";

        try {
            return geminiClient.models.generateContent("gemini-2.5-flash", prompt, null).text();
        } catch (Exception e) {
            return "Đầu bếp AI đang bận nấu ăn, vui lòng thử lại sau nhé!";
        }
    }

    public String generateProductMarketingContent(String productName) {
        String prompt = "Đóng vai một chuyên gia Copywriter & Marketing thực chiến cho siêu thị thực phẩm sạch MiniMart.\n" +
                "Nhiệm vụ: Viết một đoạn mô tả sản phẩm (khoảng 3-4 câu, 50-70 từ) để chốt sale ngay lập tức cho sản phẩm: [" + productName + "].\n" +
                "Yêu cầu khắt khe:\n" +
                "1. Câu đầu tiên: Hook (Thu hút sự chú ý, đánh vào điểm nổi bật nhất như độ tươi ngon, nguồn gốc).\n" +
                "2. Câu thứ hai: Lợi ích/Giá trị (Sản phẩm này giúp ích gì cho bữa ăn gia đình, sức khỏe, tiện lợi ra sao).\n" +
                "3. Câu cuối cùng: Call to action (Kêu gọi mua ngay, nhấn mạnh sự an tâm).\n" +
                "4. Giọng văn: Gần gũi, thấu hiểu tâm lý người nội trợ, kích thích vị giác.\n" +
                "5. FORMAT: Trả về ĐÚNG MỘT đoạn văn bản thuần túy, tuyệt đối KHÔNG DÙNG dấu *, #, in đậm, hay tiêu đề.";

        try {
            return geminiClient.models.generateContent("gemini-2.5-flash", prompt, null).text();
        } catch (Exception e) {
            System.err.println("❌ LỖI GỌI AI (Mô tả sản phẩm): " + e.getMessage());
            e.printStackTrace();
            return "Sản phẩm [" + productName + "] tươi ngon mỗi ngày, đảm bảo vệ sinh an toàn thực phẩm. Đặt mua ngay tại MiniMart để nhận giá ưu đãi!";
        }
    }
}