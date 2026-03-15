package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.Category;
import com.minimart.backend.entity.Product;
import com.minimart.backend.entity.ProductImage;
import com.minimart.backend.repository.CategoryRepository;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin("*")
public class AdminProductController {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private AIService aiService;

    // 1. LẤY DANH SÁCH (CÓ PHÂN TRANG & LỌC TRẠNG THÁI)
    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "NEWEST") String sortMode,
            @RequestParam(defaultValue = "active") String status) {

        Sort sort = Sort.by(Sort.Direction.DESC, "product_id");
        if ("OLDEST".equals(sortMode)) sort = Sort.by(Sort.Direction.ASC, "product_id");
        else if ("PRICE_ASC".equals(sortMode)) sort = Sort.by(Sort.Direction.ASC, "price");
        else if ("PRICE_DESC".equals(sortMode)) sort = Sort.by(Sort.Direction.DESC, "price");

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(productRepository.findWithFilters(search, categoryId, status, pageable));
    }

    // 2. THÊM / SỬA SẢN PHẨM
    @PostMapping
    public ResponseEntity<?> saveProduct(
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "imageUrl", required = false) String imageUrl,
            @RequestParam(value = "extraImages", required = false) MultipartFile[] extraImages,
            @RequestParam(value = "extraImageUrls", required = false) List<String> extraImageUrls) {

        // VALIDATION ĐẦU VÀO
        if (name == null || name.trim().isEmpty()) return ResponseEntity.badRequest().body("Tên sản phẩm không được để trống!");
        if (price == null || price < 0) return ResponseEntity.badRequest().body("Giá bán không hợp lệ!");
        if (stockQuantity == null || stockQuantity < 0) return ResponseEntity.badRequest().body("Tồn kho không hợp lệ!");
        if (categoryId == null) return ResponseEntity.badRequest().body("Vui lòng chọn danh mục!");

        // KIỂM TRA TRÙNG TÊN
        if (productId == null) {
            if (productRepository.existsByName(name.trim())) return ResponseEntity.badRequest().body("Tên sản phẩm này đã tồn tại!");
        } else {
            Optional<Product> existingProduct = productRepository.findByName(name.trim());
            if (existingProduct.isPresent() && !existingProduct.get().getProductId().equals(productId)) {
                return ResponseEntity.badRequest().body("Tên sản phẩm đã bị trùng với một mặt hàng khác!");
            }
        }

        Product product = new Product();
        if (productId != null) {
            product = productRepository.findById(productId).orElse(new Product());
            product.getImages().clear(); // Xóa sạch ảnh phụ cũ để lưu mới
        }

        if (product.getStatus() == null) product.setStatus("active");

        product.setName(name);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStockQuantity(stockQuantity);
        product.setDescription(description);

        Optional<Category> catOpt = categoryRepository.findById(categoryId);
        catOpt.ifPresent(product::setCategory);

        try {
            // XỬ LÝ ẢNH CHÍNH
            if (imageFile != null && !imageFile.isEmpty()) {
                String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
                product.setThumbnailUrl("data:" + imageFile.getContentType() + ";base64," + base64Image);
            } else if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                product.setThumbnailUrl(imageUrl.trim());
            } else if (product.getThumbnailUrl() == null) {
                product.setThumbnailUrl("https://placehold.co/400x400?text=No+Image");
            }

            // XỬ LÝ ẢNH PHỤ (GALLERY)
            int sortOrder = 1;

            // Lọc từ mảng File tải lên
            if (extraImages != null && extraImages.length > 0) {
                for (MultipartFile file : extraImages) {
                    if (!file.isEmpty()) {
                        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
                        ProductImage pImage = new ProductImage();
                        pImage.setImageUrl("data:" + file.getContentType() + ";base64," + base64Image);
                        pImage.setSortOrder(sortOrder++);
                        pImage.setProduct(product);
                        product.getImages().add(pImage);
                    }
                }
            }

            // Lọc từ mảng Link URL dán vào
            if (extraImageUrls != null && !extraImageUrls.isEmpty()) {
                for (String url : extraImageUrls) {
                    if (url != null && !url.trim().isEmpty()) {
                        ProductImage pImage = new ProductImage();
                        pImage.setImageUrl(url.trim());
                        pImage.setSortOrder(sortOrder++);
                        pImage.setProduct(product);
                        product.getImages().add(pImage);
                    }
                }
            }

            return ResponseEntity.ok(productRepository.save(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xử lý hình ảnh: " + e.getMessage());
        }
    }

    // 3. XÓA MỀM (THÙNG RÁC)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStatus("inactive");
            productRepository.save(product);
            return ResponseEntity.ok("Chuyển vào thùng rác thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy sản phẩm!");
    }

    // 4. KHÔI PHỤC
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreProduct(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setStatus("active");
            productRepository.save(product);
            return ResponseEntity.ok("Khôi phục thành công!");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy sản phẩm!");
    }

    // 5. GỌI AI MÔ TẢ
    @PostMapping("/generate-ai-desc")
    public ResponseEntity<?> generateAiDescription(@RequestBody Map<String, String> payload) {
        String productName = payload.get("productName");
        if (productName == null || productName.trim().isEmpty()) return ResponseEntity.badRequest().body("Vui lòng nhập tên sản phẩm.");
        return ResponseEntity.ok(Map.of("description", aiService.generateProductMarketingContent(productName)));
    }
}