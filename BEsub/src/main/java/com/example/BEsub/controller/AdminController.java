package com.example.BEsub.controller;

import com.example.BEsub.dtos.AdminProfileDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.dtos.OrderStatusChangeDTO;
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
}
