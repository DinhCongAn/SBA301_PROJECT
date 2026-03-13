package com.minimart.backend.repository;

import com.minimart.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser_UserIdOrderByIsDefaultDesc(Long userId);
    List<Address> findByUser_UserId(Long userId);
}