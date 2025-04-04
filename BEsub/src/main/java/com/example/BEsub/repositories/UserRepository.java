package com.example.BEsub.repositories;

import com.example.BEsub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmailOrUsernameOrPhone(String email, String username, String phone);
    Optional<User> findByUsernameOrEmail(String userName, String email);
}
