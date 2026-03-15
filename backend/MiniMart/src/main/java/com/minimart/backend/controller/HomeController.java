package com.minimart.backend.controller;

import com.minimart.backend.dto.HomeResponse;
import com.minimart.backend.repository.CategoryRepository;
import com.minimart.backend.repository.ProductRepository;
import com.minimart.backend.repository.SliderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "http://localhost:5173")
public class HomeController {

    @Autowired private SliderRepository sliderRepo;
    @Autowired private CategoryRepository categoryRepo;
    @Autowired private ProductRepository productRepo;

    @GetMapping
    public HomeResponse getHomeData() {
        return new HomeResponse(
                sliderRepo.findByStatusOrderByOrderNumberAsc("active"),
                categoryRepo.findByStatus("ACTIVE"),
                productRepo.findTop16ByStatusOrderByProductIdDesc("active")
        );
    }
}