package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.enums.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import com.example.BEsub.security.JwtUtil;
import jakarta.transaction.Transactional;
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

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserResponseDTO login(UserLoginDTO loginDTO) {
        User user = userRepository.findByUsernameOrEmail(loginDTO.getUsernameOrEmail(), loginDTO.getUsernameOrEmail())
                .orElseThrow(() -> new AppException("Invalid username or email"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPasswordHash())) {
            throw new AppException("Invalid password");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserResponseDTO dto = mapToUserResponseDTO(user);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        dto.setToken(token);
        return dto;
    }

    @Override
    public Long getUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"));
        return user.getId();
    }

    @Override
    public UserResponseDTO register(UserRegisterDTO registerDTO) {
        if (userRepository.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new AppException("Username already exists");
        }
        if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
            throw new AppException("Email already exists");
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

        UserResponseDTO dto = mapToUserResponseDTO(user);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        dto.setToken(token);
        return dto;
    }

    @Override
    public CustomerProfileDTO getCustomerProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));

        CustomerProfileDTO profileDTO = new CustomerProfileDTO();
        profileDTO.setEmail(user.getEmail());
        profileDTO.setName(user.getName());
        profileDTO.setUsername(user.getUsername());
        profileDTO.setPhone(user.getPhone());
        profileDTO.setGender(user.getGender());
        profileDTO.setDateOfBirth(user.getDateOfBirth());
        profileDTO.setAddresses(getUserAddresses(userId));
        return profileDTO;
    }

    @Override
    public UserAddressDTO addAddress(Long userId, UserAddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));

        UserAddress address = new UserAddress();
        address.setCity(addressDTO.getCity());
        address.setStreet(addressDTO.getStreet());
        address.setHouseNumber(addressDTO.getHouseNumber());
        address.setUser(user);

        // Nếu đây là địa chỉ đầu tiên, đặt làm mặc định
        long addressCount = addressRepository.countByUserId(userId);
        if (addressCount==0) {
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
                .orElseThrow(() -> new AppException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new AppException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    public CustomerProfileDTO updateProfile(Long userId, UserUpdateDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));

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
                .orElseThrow(() -> new AppException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new AppException("Cannot delete another Admin");
        }
        userRepository.delete(user);
    }

    @Override
    public List<UserAddressDTO> getUserAddresses(Long userId) {
        List<UserAddress> addresses = addressRepository.findByUserId(userId);
        return mapToUserAddressDTOList(addresses);
    }

    @Override
    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));

        // Đặt tất cả địa chỉ khác thành không mặc định
        user.getAddresses().forEach(address -> address.setIsDefault(false));
        addressRepository.saveAll(user.getAddresses());

        // Đặt địa chỉ được chọn thành mặc định
        UserAddress defaultAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException("Address not found"));
        if (!defaultAddress.getUser().getId().equals(userId)) {
            throw new AppException("Address does not belong to this user");
        }
        defaultAddress.setIsDefault(true);
        addressRepository.save(defaultAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));
        UserAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new AppException("Address does not belong to this user");
        }
        if (address.getIsDefault()) {
            throw new AppException("Cannot delete default address!");
        }

        long addressCount = addressRepository.countByUserId(userId);
        if (addressCount <= 1) {
            throw new AppException("Cannot delete last address!");
        }

        addressRepository.delete(address);
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
