package com.minimart.backend.controller.admin;

import com.minimart.backend.entity.Slider;
import com.minimart.backend.repository.SliderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/sliders")
@CrossOrigin("*")
public class AdminSliderController {

    @Autowired private SliderRepository sliderRepository;

    // 🚀 ĐÃ SỬA: Lấy danh sách kèm Lọc & Tìm kiếm
    @GetMapping
    public ResponseEntity<List<Slider>> getSliders(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String status) {
        return ResponseEntity.ok(sliderRepository.findWithFilters(search, status));
    }

    @PostMapping
    public ResponseEntity<?> saveSlider(@RequestBody Slider slider) {
        if (slider.getStatus() == null || slider.getStatus().isEmpty()) {
            slider.setStatus("active");
        }
        if (slider.getOrderNumber() == null) {
            slider.setOrderNumber(99);
        }
        return ResponseEntity.ok(sliderRepository.save(slider));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlider(@PathVariable Long id) {
        sliderRepository.deleteById(Math.toIntExact(id));
        return ResponseEntity.ok("Đã xóa banner thành công!");
    }
}