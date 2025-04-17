package com.example.BEsub.service;

import com.example.BEsub.dtos.*;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserResponseDTO login(UserLoginDTO loginDTO);
    UserResponseDTO register(UserRegisterDTO registerDTO);
    CustomerProfileDTO getCustomerProfile(Long userId);
    UserAddressDTO addAddress(Long userId, UserAddressDTO addressDTO);
    List<UserAddressDTO> getUserAddresses(Long userId);
    void setDefaultAddress(Long userId, Long addressId);
    CustomerProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO); // Customer
    void changePassword(Long userId, String oldPassword, String newPassword);
    void deleteUser(Long userId); // Admin
    Long getUserIdByUsername(String username);
    void deleteAddress(Long userId, Long addressId);
    List<AdminProfileDTO> getAllUsers(); // Admin
    void resetPassword(String email, String password);
}
