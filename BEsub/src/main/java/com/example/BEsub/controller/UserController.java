package com.example.BEsub.controller;

import com.example.BEsub.dtos.*;
import com.example.BEsub.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody @Valid UserLoginDTO loginDTO) {
        UserResponseDTO response = userService.login(loginDTO);
        return ResponseEntity.ok(response);
    }

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody @Valid UserRegisterDTO registerDTO) {
        System.out.println("Register endpoint reached with data: " + registerDTO);
        UserResponseDTO response = userService.register(registerDTO);
        System.out.println("Registration successful for user: " + response.getUsername());
        return ResponseEntity.status(201).body(response);
    }

    // Lấy profile của user hiện tại
    @GetMapping("/profile")
    public ResponseEntity<CustomerProfileDTO> getProfile() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();

        Long userId = userService.getUserIdByUsername(userName);

        CustomerProfileDTO profile = userService.getCustomerProfile(userId);
        return ResponseEntity.ok(profile);
    }

    // Cập nhật profile
    @PutMapping("/profile")
    public ResponseEntity<CustomerProfileDTO> updateProfile(@RequestBody @Valid UserUpdateDTO updateDTO) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);
        CustomerProfileDTO updatedProfile = userService.updateProfile(userId, updateDTO);
        return ResponseEntity.ok(updatedProfile);
    }

    // Đổi mật khẩu
    @PutMapping("/password")
    public ResponseEntity<String> changePassword(@RequestBody @Valid ChangePasswordRequest request) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);
        userService.changePassword(userId, request.oldPassword(), request.newPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    // Thêm địa chỉ
    @PostMapping("/addresses")
    public ResponseEntity<UserAddressDTO> addAddress(@RequestBody @Valid UserAddressDTO addressDTO) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);
        UserAddressDTO address = userService.addAddress(userId, addressDTO);
        return ResponseEntity.status(201).body(address);
    }

    // Lấy danh sách địa chỉ
    @GetMapping("/addresses")
    public ResponseEntity<List<UserAddressDTO>> getAddresses() {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);
        List<UserAddressDTO> addresses = userService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    // Đặt địa chỉ mặc định
    @PutMapping("/addresses/{addressId}/default")
    public ResponseEntity<String> setDefaultAddress(
            @PathVariable Long addressId) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);
        userService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok("Default address set successfully");
    }

    // Xóa địa chỉ
    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable Long addressId) {
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByUsername(userName);

        userService.deleteAddress(userId, addressId);
        return ResponseEntity.ok("Address deleted successfully");
    }

    // Helper đổi mật khẩu
    public record ChangePasswordRequest(
            @NotBlank(message = "Old password is required")
            String oldPassword,
            @NotBlank(message = "New password is required")
            @Size(min = 6, message = "New password must be at least 6 characters")
            String newPassword)
    {
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

