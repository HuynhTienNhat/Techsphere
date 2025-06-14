package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.enums.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import com.example.BEsub.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private OrderRepository orderRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Hàm kiểm tra typeOfAddress hợp lệ
    private boolean isValidTypeOfAddress(String type) {
        return type != null && (type.equals("Nhà riêng") || type.equals("Văn phòng"));
    }

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
        if (userRepository.findByPhone(registerDTO.getPhone()).isPresent()) {
            throw new AppException("Phone number already exists");
        }

        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setName(registerDTO.getName());
        user.setUsername(registerDTO.getUsername());
        user.setPasswordHash(passwordEncoder.encode(registerDTO.getPassword()));
        user.setPhone(registerDTO.getPhone());
        user.setGender(registerDTO.getGender());
        user.setDateOfBirth(registerDTO.getDateOfBirth());
        user.setRole(Role.CUSTOMER);
        user.setCreatedAt(LocalDateTime.now());
        Cart cart = Cart.builder()
                        .cartItems(List.of())
                        .user(user)
                        .build();
        user.setCart(cart);

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
        profileDTO.setRole(user.getRole().name());
        return profileDTO;
    }

    @Override
    public UserAddressDTO addAddress(Long userId, UserAddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));

        // Kiểm tra typeOfAddress hợp lệ
        if (!isValidTypeOfAddress(addressDTO.getTypeOfAddress())) {
            throw new AppException("Invalid address type: " + addressDTO.getTypeOfAddress());
        }

        UserAddress address = new UserAddress();
        address.setCity(addressDTO.getCity());
        address.setDistrict(addressDTO.getDistrict());
        address.setStreetAndHouseNumber(addressDTO.getStreetAndHouseNumber());
        address.setTypeOfAddress(addressDTO.getTypeOfAddress());
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

        List<OrderStatus> incompleteOrders = List.of(OrderStatus.CONFIRMING, OrderStatus.PREPARING, OrderStatus.DELIVERING);

        // Kiểm tra các đơn hàng chưa hoàn thành liên quan đến User
        boolean hasIncompleteOrdersByUser = orderRepository
                .findByUserAndStatusIn(user, incompleteOrders)
                .stream()
                .anyMatch(order -> incompleteOrders.contains(order.getStatus()));

        // Kiểm tra các đơn hàng chưa hoàn thành liên quan đến UserAddress
        boolean hasIncompleteOrdersByAddress = user.getAddresses().stream()
                .anyMatch(address -> orderRepository
                        .findByAddressAndStatusIn(address, incompleteOrders)
                        .stream()
                        .anyMatch(order -> incompleteOrders.contains(order.getStatus())));

        // Nếu có đơn hàng chưa hoàn thành, từ chối xóa
        if (hasIncompleteOrdersByUser || hasIncompleteOrdersByAddress) {
            throw new AppException("Cannot delete user because they have incomplete orders");
        }

        userRepository.delete(user);
    }

    @Override
    public List<UserAddressDTO> getUserAddresses(Long userId) {
        List<UserAddress> addresses = addressRepository.findByUserId(userId);
        return mapToUserAddressDTOList(addresses);
    }

    @Override
    public UserAddressDTO getAddressById(Long addressId) {
        Long userId = getCurrentUserId();
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException("Address not found"));
        return mapToUserAddressDTO(address);
    }

    @Override
    public UserAddressDTO getAddressByIdAndUserId(Long userId, Long addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AppException("Address not found"));
        return mapToUserAddressDTO(address);
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

        if (address.getIsDefault()) {
            throw new AppException("Cannot delete default address!");
        }

        long addressCount = addressRepository.countByUserId(userId);
        if (addressCount <= 1) {
            throw new AppException("Cannot delete last address!");
        }

        addressRepository.delete(address);
    }

    @Override
    public UserAddressDTO updateAddress(Long userId, Long addressId, UserAddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra typeOfAddress hợp lệ
        if (!isValidTypeOfAddress(addressDTO.getTypeOfAddress())) {
            throw new AppException("Invalid address type: " + addressDTO.getTypeOfAddress());
        }

        UserAddress address = user.getAddresses().stream()
                .filter(addr -> addr.getId().equals(addressId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Address not found"));

        address.setCity(addressDTO.getCity());
        address.setDistrict(addressDTO.getDistrict());
        address.setStreetAndHouseNumber(addressDTO.getStreetAndHouseNumber());
        address.setTypeOfAddress(addressDTO.getTypeOfAddress());
        address.setIsDefault(addressDTO.getIsDefault() != null && addressDTO.getIsDefault());

        // Nếu đặt địa chỉ này làm mặc định, bỏ mặc định các địa chỉ khác
        if (address.getIsDefault()) {
            user.getAddresses().forEach(addr -> {
                if (!addr.getId().equals(addressId)) {
                    addr.setIsDefault(false);
                }
            });
        }

        userRepository.save(user);
        return mapToUserAddressDTO(address);
    }


    @Override
    public void resetPassword(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found"));

        user.setPasswordHash(passwordEncoder.encode(password));
        userRepository.save(user);
    }

    @Override
    public List<AdminProfileDTO> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream().map(this::mapToAdminProfileDTO).collect(Collectors.toList());
    }

    @Override
    public AdminProfileDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));
        return mapToAdminProfileDTO(user);
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
        dto.setDistrict(address.getDistrict());
        dto.setStreetAndHouseNumber(address.getStreetAndHouseNumber());
        dto.setIsDefault(address.getIsDefault());
        dto.setTypeOfAddress(address.getTypeOfAddress());
        return dto;
    }

    private List<UserAddressDTO> mapToUserAddressDTOList(List<UserAddress> addresses) {
        return addresses.stream()
                .map(this::mapToUserAddressDTO)
                .collect(Collectors.toList());
    }

    private AdminProfileDTO mapToAdminProfileDTO(User user) {
        AdminProfileDTO dto = new AdminProfileDTO();
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
        dto.setAddresses(getUserAddresses(user.getId()));
        return dto;
    }

    @Override
    public Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"))
                .getId();
    }
}
