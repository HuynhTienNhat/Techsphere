package com.example.BEsub.service;

import com.example.BEsub.dtos.*;

import java.util.List;

public interface UserService {
    UserResponseDTO login(UserLoginDTO loginDTO);
    UserResponseDTO register(UserRegisterDTO registerDTO);
    CustomerProfileDTO getCustomerProfile(Long userId);
    UserAddressDTO addAddress(Long userId, UserAddressDTO addressDTO);
    UserAddressDTO getAddressById(Long addressId);
    UserAddressDTO getAddressByIdAndUserId(Long userId, Long addressId);
    List<UserAddressDTO> getUserAddresses(Long userId);
    void setDefaultAddress(Long userId, Long addressId);
    CustomerProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO); // Customer
    void changePassword(Long userId, String oldPassword, String newPassword);
    void deleteUser(Long userId); // Admin
    Long getUserIdByUsername(String username);
    void deleteAddress(Long userId, Long addressId);
    List<AdminProfileDTO> getAllUsers(); // Admin
    AdminProfileDTO getUserById(Long userId); // Admin
    void resetPassword(String email, String password);
    UserAddressDTO updateAddress(Long userId, Long addressId, UserAddressDTO addressDTO);
    Long getCurrentUserId();
}
