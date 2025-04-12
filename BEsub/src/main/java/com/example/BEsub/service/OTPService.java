package com.example.BEsub.service;

import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.OTP;
import com.example.BEsub.repositories.OTPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Random;

@Service
public class OTPService {

    @Autowired
    OTPRepository otpRepository;

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    BCryptPasswordEncoder passwordEncoder;

    private static final int OTP_EXPIRATION_MINUTES = 10;

    public void generateOTP(String email){
        String otp = generateOTP();

        LocalDateTime created = LocalDateTime.now();
        LocalDateTime expired = LocalDateTime.now().plusMinutes(OTP_EXPIRATION_MINUTES);

        OTP otpSave = OTP.builder()
                .otp(passwordEncoder.encode(otp))
                .created_at(created)
                .expired_at(expired)
                .email(email)
                .tryTime(0)
                .build();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Mã xác minh của bạn");
            message.setText("Mã xác minh (OTP) của bạn là: " + otp + "\nVui lòng không chia sẻ với người khác.\n OTP sẽ hết hạn sau 10 phút.");

            javaMailSender.send(message);
        }
        catch (Exception e) {
            throw new AppException("Lỗi gửi email: "+e.getMessage());
        }

        otpRepository.save(otpSave);
    }

    public boolean verifyOTP(String enteredOtp,String email){
        if(enteredOtp == null ) throw new AppException("OTP can not be null");

        OTP otp = otpRepository.findByEmail(email).orElseThrow(()->new AppException("OTP not found"));
        String otpHash = otp.getOtp();
        LocalDateTime create_at = otp.getCreated_at();

        long minutesElapsed = ChronoUnit.MINUTES.between(create_at, LocalDateTime.now());
        if (minutesElapsed > OTP_EXPIRATION_MINUTES) {
            otpRepository.delete(otp);
            throw new AppException("OTP has expired");
        }

        boolean otpMatches = passwordEncoder.matches(enteredOtp,otpHash);

        if(!otpMatches){
            otp.setTryTime(otp.getTryTime()+1);
            otpRepository.save(otp);
            return false;
        }
        if(otp.getTryTime()>=3){
            otpRepository.delete(otp);
            throw new AppException("You have tried 3 times, OTP is no longer valid.");
        }
        return true;
    }

    private String generateOTP() {
        Random rand = new Random();
        return String.format("%06d", rand.nextInt(1000000));
    }
}
