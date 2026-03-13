package com.minimart.backend.controller;

import com.minimart.backend.entity.Address;
import com.minimart.backend.entity.User;
import com.minimart.backend.repository.AddressRepository;
import com.minimart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    // Lấy danh sách địa chỉ (Mặc định xếp trên cùng)
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserAddresses(@PathVariable Long userId) {
        return ResponseEntity.ok(addressRepository.findByUser_UserIdOrderByIsDefaultDesc(userId));
    }

    // Thêm địa chỉ mới
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addAddress(@PathVariable Long userId, @RequestBody Address request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) return ResponseEntity.badRequest().body("User không tồn tại");

        List<Address> existing = addressRepository.findByUser_UserId(userId);
        if (existing.isEmpty()) request.setIsDefault(true); // Đầu tiên luôn là mặc định
        if (request.getIsDefault()) resetDefaultAddresses(userId);

        request.setUser(userOpt.get());
        return ResponseEntity.ok(addressRepository.save(request));
    }

    // Cập nhật địa chỉ
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Address request) {
        Optional<Address> existingOpt = addressRepository.findById(id);
        if (existingOpt.isPresent()) {
            Address address = existingOpt.get();
            address.setReceiverName(request.getReceiverName());
            address.setPhone(request.getPhone());
            address.setProvince(request.getProvince());
            address.setCity(request.getCity());
            address.setStreet(request.getStreet());
            address.setZipCode(request.getZipCode());

            if (request.getIsDefault() && !address.getIsDefault()) {
                resetDefaultAddresses(address.getUser().getUserId());
                address.setIsDefault(true);
            }
            return ResponseEntity.ok(addressRepository.save(address));
        }
        return ResponseEntity.badRequest().body("Không tìm thấy địa chỉ");
    }

    // Xóa địa chỉ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        Optional<Address> addressOpt = addressRepository.findById(id);
        if(addressOpt.isPresent()){
            Address addr = addressOpt.get();
            addressRepository.deleteById(id);
            // Nếu xóa trúng cái mặc định, random lấy 1 cái khác làm mặc định
            if(addr.getIsDefault()) {
                List<Address> remains = addressRepository.findByUser_UserId(addr.getUser().getUserId());
                if(!remains.isEmpty()) {
                    Address first = remains.get(0);
                    first.setIsDefault(true);
                    addressRepository.save(first);
                }
            }
            return ResponseEntity.ok("Đã xóa địa chỉ");
        }
        return ResponseEntity.badRequest().build();
    }

    // Đặt làm mặc định nhanh
    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefault(@PathVariable Long id) {
        Address address = addressRepository.findById(id).orElse(null);
        if (address != null) {
            resetDefaultAddresses(address.getUser().getUserId());
            address.setIsDefault(true);
            return ResponseEntity.ok(addressRepository.save(address));
        }
        return ResponseEntity.badRequest().build();
    }

    // Tắt cờ Mặc định của các địa chỉ cũ
    private void resetDefaultAddresses(Long userId) {
        List<Address> addresses = addressRepository.findByUser_UserId(userId);
        for (Address addr : addresses) {
            if (addr.getIsDefault()) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}