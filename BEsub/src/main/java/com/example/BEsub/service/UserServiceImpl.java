package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.enums.*;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAddressRepository addressRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO login(UserLoginDTO loginDTO) {
        User user = userRepository.findByUsernameOrEmail(loginDTO.getUsernameOrEmail(), loginDTO.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Invalid username or email"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return mapToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO register(UserRegisterDTO registerDTO) {
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setName(registerDTO.getName());
        user.setUsername(registerDTO.getUsername());
        user.setPasswordHash(passwordEncoder.encode(registerDTO.getPassword()));
        user.setPhone(registerDTO.getPhone());
        user.setGender(registerDTO.getGender());
        user.setDateOfBirth(registerDTO.getDateOfBirth());
        user.setRole(Role.CUSTOMER); // Mặc định là CUSTOMER
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToUserResponseDTO(user);
    }

    @Override
    public CustomerProfileDTO getCustomerProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CustomerProfileDTO profileDTO = new CustomerProfileDTO();
        profileDTO.setEmail(user.getEmail());
        profileDTO.setName(user.getName());
        profileDTO.setUsername(user.getUsername());
        profileDTO.setPhone(user.getPhone());
        profileDTO.setGender(user.getGender());
        profileDTO.setDateOfBirth(user.getDateOfBirth());
        profileDTO.setAddresses(mapToUserAddressDTOList(user.getAddresses()));
        return profileDTO;
    }

    @Override
    public UserAddressDTO addAddress(Long userId, UserAddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserAddress address = new UserAddress();
        address.setCity(addressDTO.getCity());
        address.setStreet(addressDTO.getStreet());
        address.setHouseNumber(addressDTO.getHouseNumber());
        address.setUser(user);

        // Nếu đây là địa chỉ đầu tiên, đặt làm mặc định
        if (user.getAddresses().isEmpty()) {
            address.setIsDefault(true);
        } else {
            address.setIsDefault(addressDTO.getIsDefault() != null && addressDTO.getIsDefault());
        }

        address = addressRepository.save(address);
        return mapToUserAddressDTO(address);
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public CustomerProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Chỉ cập nhật field nào được gửi
        if (updateDTO.getName() != null) {
            user.setName(updateDTO.getName());
        }
        if (updateDTO.getPhone() != null) {
            user.setPhone(updateDTO.getPhone());
        }
        if (updateDTO.getGender() != null) {
            user.setGender(updateDTO.getGender());
        }
        if (updateDTO.getDateOfBirth() != null) {
            user.setDateOfBirth(updateDTO.getDateOfBirth());
        }

        user = userRepository.save(user);
        return getCustomerProfile(userId); // Trả về profile đã cập nhật
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot delete another Admin");
        }
        userRepository.delete(user);
    }

    @Override
    public List<UserAddressDTO> getUserAddresses(Long userId) {
        List<UserAddress> addresses = addressRepository.findByUserId(userId);
        return mapToUserAddressDTOList(addresses);
    }

    @Override
    public void setDefaultAddress(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Đặt tất cả địa chỉ khác thành không mặc định
        user.getAddresses().forEach(address -> address.setIsDefault(false));
        addressRepository.saveAll(user.getAddresses());

        // Đặt địa chỉ được chọn thành mặc định
        UserAddress defaultAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        if (!defaultAddress.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to this user");
        }
        defaultAddress.setIsDefault(true);
        addressRepository.save(defaultAddress);
    }

    // Helper methods to map Entity to DTO
    private UserResponseDTO mapToUserResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setPhone(user.getPhone());
        dto.setGender(user.getGender());
        dto.setDateOfBirth(user.getDateOfBirth());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        return dto;
    }

    private UserAddressDTO mapToUserAddressDTO(UserAddress address) {
        UserAddressDTO dto = new UserAddressDTO();
        dto.setId(address.getId());
        dto.setCity(address.getCity());
        dto.setStreet(address.getStreet());
        dto.setHouseNumber(address.getHouseNumber());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }

    private List<UserAddressDTO> mapToUserAddressDTOList(List<UserAddress> addresses) {
        return addresses.stream()
                .map(this::mapToUserAddressDTO)
                .collect(Collectors.toList());
    }
}
