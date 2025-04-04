package com.example.BEsub.controller;

import com.example.BEsub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    // Xóa user
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(
            @RequestParam Long adminId, // Giả sử adminId từ token
            @PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
