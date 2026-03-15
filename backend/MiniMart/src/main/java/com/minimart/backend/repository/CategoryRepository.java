package com.minimart.backend.repository;

import com.minimart.backend.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query(value = "SELECT * FROM categories c WHERE " +
            "(:search IS NULL OR c.name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%') AND " +
            "(c.status = :status)",
            countQuery = "SELECT count(*) FROM categories c WHERE " +
                    "(:search IS NULL OR c.name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE '%' + :search + '%') AND " +
                    "(c.status = :status)",
            nativeQuery = true)
    Page<Category> findWithFilters(@Param("search") String search, @Param("status") String status, Pageable pageable);

    List<Category> findByStatus(String status);
    boolean existsByName(String name);
    Optional<Category> findByName(String name);
}
