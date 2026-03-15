package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.Promotion;
import com.minimart.backend.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin("*")
public class AdminPromotionController {

    @Autowired private PromotionRepository promotionRepository;

    // 1. Lấy danh sách kèm Bộ Lọc & Phân trang
    @GetMapping
    public ResponseEntity<Page<Promotion>> getPromotions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String type,
            @RequestParam(required = false) Boolean active) { // active có thể là null, true, hoặc false

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(promotionRepository.findWithFilters(search, type, active, pageable));
    }

    // 2. Thêm mới / Cập nhật
    @PostMapping
    public ResponseEntity<?> savePromotion(@RequestBody Promotion promo) {
        promo.setCode(promo.getCode().trim().toUpperCase());

        if (promo.getId() == null && promotionRepository.existsByCode(promo.getCode())) {
            return ResponseEntity.badRequest().body("Mã khuyến mãi này đã tồn tại!");
        }

        if (promo.getId() != null) {
            Optional<Promotion> existing = promotionRepository.findByCode(promo.getCode());
            if (existing.isPresent() && !existing.get().getId().equals(promo.getId())) {
                return ResponseEntity.badRequest().body("Mã Code bị trùng với một khuyến mãi khác!");
            }
        }

        if (promo.getIsActive() == null) promo.setIsActive(true);
        return ResponseEntity.ok(promotionRepository.save(promo));
    }

    // 3. Bật/Tắt (Toggle)
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        Optional<Promotion> promoOpt = promotionRepository.findById(id);
        if (promoOpt.isEmpty()) return ResponseEntity.badRequest().body("Không tìm thấy mã!");

        Promotion p = promoOpt.get();
        p.setIsActive(!p.getIsActive());
        return ResponseEntity.ok(promotionRepository.save(p));
    }

    // 4. Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        promotionRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa mã khuyến mãi!");
    }
}