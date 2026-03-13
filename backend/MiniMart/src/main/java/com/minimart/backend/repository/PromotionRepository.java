package com.minimart.backend.repository;

import com.minimart.backend.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Tìm mã giảm giá theo Code và đảm bảo mã đó đang còn hiệu lực (isActive = true)
    Optional<Promotion> findByCodeAndIsActiveTrue(String code);

}