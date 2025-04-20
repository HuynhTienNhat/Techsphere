package com.example.BEsub.controller;

import com.example.BEsub.dtos.*;
import com.example.BEsub.enums.OrderStatus;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.service.OrderService;
import com.example.BEsub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    // Xóa user
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        String adminName = SecurityContextHolder.getContext().getAuthentication().getName();
        Long adminId = userService.getUserIdByUsername(adminName);

        if(Objects.equals(adminId, userId)){
            throw new AppException("Admin cannot delete themselves");
        }

        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Lấy danh sách tất cả người dùng
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AdminProfileDTO>> getAllUsers() {
        List<AdminProfileDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/orders/getInfor/{year}")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<DashboardInformationDTO> getDashboardInformation(@PathVariable int year){
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getDashboardInformation(year));
    }

    @GetMapping("/orders/getYears")
    @PreAuthorize("hasRole('ADMIN')")
    ResponseEntity<List<Integer>> getDistinctOrderYears(){
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getDistinctOrderYears());
    }

    // Lấy thông tin người dùng theo id
    @GetMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProfileDTO> getUserById(@PathVariable Long userId) {
        AdminProfileDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/{userId}/addresses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserAddressDTO>> getUserAddresses(@PathVariable Long userId) {
        List<UserAddressDTO> addresses = userService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/users/{userId}/addresses/{addressId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserAddressDTO> getUserAddressById(@PathVariable Long userId, @PathVariable Long addressId) {
        UserAddressDTO address = userService.getAddressByIdAndUserId(userId, addressId);
        return ResponseEntity.ok(address);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getAllOrders());
    }

    @GetMapping("/orders/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrdersByUserId(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getAllOrdersByUserId(userId));
    }

    @PutMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> changeStatusOfOrder(@RequestBody OrderStatusChangeDTO orderStatusChangeDTO) {
        orderService.changeStatusOfOrder(orderStatusChangeDTO);
        return ResponseEntity.status(HttpStatus.OK).body("Change status of order successfully");
    }

    @GetMapping("/orders/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrdersByStatus(@RequestParam String status) {
        OrderStatus orderStatus = OrderStatus.fromString(status);
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getAllOrdersByStatus(orderStatus));
    }

    @GetMapping("/orders/month-year")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrdersByMonthAndYear(@RequestParam int month, @RequestParam int year) {
        return ResponseEntity.status(HttpStatus.OK).body(orderService.getAllOrdersByMonthAndYear(month, year));
    }
}
