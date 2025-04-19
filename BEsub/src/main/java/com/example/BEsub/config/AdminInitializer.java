package com.example.BEsub.config;

import com.example.BEsub.enums.*;
import com.example.BEsub.models.User;
import com.example.BEsub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class AdminInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception{
        if (userRepository.findByRole(Role.ADMIN).isEmpty()){
            User admin = new User();
            admin.setEmail("admin@gmail.com");
            admin.setUsername("admin");
            admin.setName("Admin");
            admin.setPhone("0945722192");
            admin.setGender(Gender.FEMALE);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setDateOfBirth(LocalDate.of(2005, 3, 4));
            admin.setCreatedAt(LocalDateTime.now());
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("Admin account created with username: admin, password: admin123");
        } else {
            System.out.println("Admin account already exists.");
        }

        if (userRepository.findByRole(Role.CUSTOMER).isEmpty()){
            User sampleCustomer = new User();
            sampleCustomer.setEmail("sampleCustomer@gmail.com");
            sampleCustomer.setUsername("sampleCustomer");
            sampleCustomer.setName("Sample Customer");
            sampleCustomer.setPhone("0337939487");
            sampleCustomer.setGender(Gender.MALE);
            sampleCustomer.setPasswordHash(passwordEncoder.encode("123456"));
            sampleCustomer.setDateOfBirth(LocalDate.of(2005, 3, 4));
            sampleCustomer.setCreatedAt(LocalDateTime.now());
            sampleCustomer.setRole(Role.CUSTOMER);

            userRepository.save(sampleCustomer);

            System.out.println("CUSTOMER account created with username: sampleCustomer, password: 123456");
        } else  {
            System.out.println("CUSTOMER account already exists.");
        }
    }
}
