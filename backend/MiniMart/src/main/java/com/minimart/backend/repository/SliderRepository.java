package com.minimart.backend.repository;

import com.minimart.backend.entity.Slider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SliderRepository extends JpaRepository<Slider, Integer> {
    List<Slider> findByStatusOrderByOrderNumberAsc(String status);
}
