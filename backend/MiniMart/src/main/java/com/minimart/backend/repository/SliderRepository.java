package com.minimart.backend.repository;

import com.minimart.backend.entity.Slider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SliderRepository extends JpaRepository<Slider, Integer> {
    List<Slider> findByStatusOrderByOrderNumberAsc(String status);
    List<Slider> findAllByOrderByOrderNumberAsc();
    @Query("SELECT s FROM Slider s WHERE " +
            "(:search IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:status IS NULL OR :status = 'ALL' OR s.status = :status) " +
            "ORDER BY s.orderNumber ASC")
    List<Slider> findWithFilters(@Param("search") String search, @Param("status") String status);
}
