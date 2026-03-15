package com.minimart.backend.repository;

import com.minimart.backend.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Tìm mã giảm giá theo Code và đảm bảo mã đó đang còn hiệu lực (isActive = true)
    Optional<Promotion> findByCodeAndIsActiveTrue(String code);

    @Query("SELECT p FROM Promotion p WHERE " +
            "(:search IS NULL OR LOWER(p.code) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
            "(:type IS NULL OR :type = 'ALL' OR p.discountType = :type) AND " +
            "(:isActive IS NULL OR p.isActive = :isActive)")
    Page<Promotion> findWithFilters(
            @Param("search") String search,
            @Param("type") String type,
            @Param("isActive") Boolean isActive,
            Pageable pageable);

    Optional<Promotion> findByCode(String code);
    boolean existsByCode(String code);

}