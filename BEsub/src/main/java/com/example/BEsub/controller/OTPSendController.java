package com.example.BEsub.controller;

import com.example.BEsub.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/otp")
public class OTPSendController {

    @Autowired
    OTPService otpService;

    @PostMapping
    ResponseEntity<String> sendOTP(@RequestParam String email){
        otpService.generateOTP(email);
        return ResponseEntity.status(HttpStatus.OK).body("Email has sent");
    }

    @GetMapping
    ResponseEntity<String> verifyOTP(@RequestParam String enteredOtp, @RequestParam String email){
        String result = otpService.verifyOTP(enteredOtp,email)?"Valid":"Invalid";
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}
