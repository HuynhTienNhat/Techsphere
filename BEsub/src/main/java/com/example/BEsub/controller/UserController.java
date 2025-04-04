package com.example.BEsub.controller;

import com.example.BEsub.dtos.*;
import com.example.BEsub.service.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserLoginDTO loginDTO) {
        UserResponseDTO response = userService.login(loginDTO);
        return ResponseEntity.ok(response);
    }

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegisterDTO registerDTO) {
        UserResponseDTO response = userService.register(registerDTO);
        return ResponseEntity.status(201).body(response);
    }

    // Lấy profile của user hiện tại
    @GetMapping("/profile")
    public ResponseEntity<CustomerProfileDTO> getProfile(@RequestParam Long userId) { // Giả sử userId từ token sau này
        CustomerProfileDTO profile = userService.getCustomerProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // Cập nhật profile
    @PutMapping("/profile")
    public ResponseEntity<CustomerProfileDTO> updateProfile(
            @RequestParam Long userId, // Giả sử userId từ token
            @RequestBody UserUpdateDTO updateDTO) {
        CustomerProfileDTO updatedProfile = userService.updateProfile(userId, updateDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    // Đổi mật khẩu
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(
            @RequestParam Long userId, // Giả sử userId từ token
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request.oldPassword(), request.newPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    // Thêm địa chỉ
    @PostMapping("/addresses")
    public ResponseEntity<UserAddressDTO> addAddress(
            @RequestParam Long userId, // Giả sử userId từ token
            @RequestBody UserAddressDTO addressDTO) {
        UserAddressDTO address = userService.addAddress(userId, addressDTO);
        return ResponseEntity.status(201).body(address);
    }

    // Lấy danh sách địa chỉ
    @GetMapping("/addresses")
    public ResponseEntity<List<UserAddressDTO>> getAddresses(@RequestParam Long userId) {
        List<UserAddressDTO> addresses = userService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    // Đặt địa chỉ mặc định
    @PutMapping("/addresses/{addressId}/default")
    public ResponseEntity<String> setDefaultAddress(
            @RequestParam Long userId, // Giả sử userId từ token
            @PathVariable Long addressId) {
        userService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok("Default address updated successfully");
    }

    public record ChangePasswordRequest(String oldPassword, String newPassword) {
        public ChangePasswordRequest {
            if (oldPassword == null || oldPassword.isBlank()) {
                throw new IllegalArgumentException("Old password cannot be null or blank");
            }
            if (newPassword == null || newPassword.isBlank()) {
                throw new IllegalArgumentException("New password cannot be null or blank");
            }
        }
    }
}

