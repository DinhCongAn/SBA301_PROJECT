package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.Category;
import com.minimart.backend.repository.CategoryRepository;
import com.minimart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/categories")
@CrossOrigin("*")
public class AdminCategoryController {

    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductRepository productRepository;

    // 1. Phân trang & Lọc cho bảng quản lý Danh mục
    @GetMapping
    public ResponseEntity<Page<Category>> getCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "active") String status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "category_id"));
        return ResponseEntity.ok(categoryRepository.findWithFilters(search, status, pageable));
    }

    // 2. Lấy tất cả (Dùng cho Dropdown khi thêm Sản phẩm) -> GIẢI QUYẾT LỖI 404 /all
    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll().stream()
                .filter(c -> "active".equals(c.getStatus())).toList());
    }

    // 3. Thêm / Sửa danh mục -> GIẢI QUYẾT LỖI 405 Method Not Allowed
    @PostMapping
    public ResponseEntity<?> saveCategory(
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {

        if (name == null || name.trim().isEmpty()) return ResponseEntity.badRequest().body("Tên danh mục không được để trống!");

        // Kiểm tra trùng tên
        if (categoryId == null) {
            if (categoryRepository.existsByName(name.trim())) return ResponseEntity.badRequest().body("Tên danh mục này đã tồn tại!");
        } else {
            Optional<Category> existing = categoryRepository.findByName(name.trim());
            if (existing.isPresent() && !existing.get().getCategoryId().equals(categoryId)) {
                return ResponseEntity.badRequest().body("Tên danh mục bị trùng với danh mục khác!");
            }
        }

        Category category = categoryId != null ? categoryRepository.findById(categoryId).orElse(new Category()) : new Category();
        category.setName(name.trim());
        category.setDescription(description);
        if (category.getStatus() == null) category.setStatus("active");

        try {
            // Xử lý ảnh
            if (imageFile != null && !imageFile.isEmpty()) {
                String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());
                category.setImageUrl("data:" + imageFile.getContentType() + ";base64," + base64Image);
            } else if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                category.setImageUrl(imageUrl.trim());
            }

            return ResponseEntity.ok(categoryRepository.save(category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xử lý hình ảnh: " + e.getMessage());
        }
    }

    // 4. Xóa mềm (KÈM CHECK RÀNG BUỘC SẢN PHẨM)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Optional<Category> catOpt = categoryRepository.findById(id);
        if (catOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy danh mục!");

        // Đếm số sản phẩm thuộc danh mục này
        long productCount = productRepository.countByCategory_CategoryId(id);
        if (productCount > 0) {
            return ResponseEntity.badRequest().body("❌ TỪ CHỐI XÓA: Đang có " + productCount + " sản phẩm thuộc danh mục này. Hãy chuyển chúng sang danh mục khác trước!");
        }

        Category cat = catOpt.get();
        cat.setStatus("inactive");
        categoryRepository.save(cat);
        return ResponseEntity.ok("Đã chuyển danh mục vào thùng rác!");
    }

    // 5. Khôi phục
    @PutMapping("/{id}/restore")
    public ResponseEntity<?> restoreCategory(@PathVariable Long id) {
        Optional<Category> catOpt = categoryRepository.findById(id);
        if (catOpt.isPresent()) {
            Category cat = catOpt.get();
            cat.setStatus("active");
            categoryRepository.save(cat);
            return ResponseEntity.ok("Khôi phục danh mục thành công!");
        }
        return ResponseEntity.badRequest().body("Lỗi khôi phục!");
    }
}