package com.example.BEsub.repositories;

import com.example.BEsub.enums.Role;
import com.example.BEsub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByPhone(String phone);
    Optional<User> findByUsernameOrEmail(String userName, String email);
    List<User> findByRole(Role role);

    BigDecimal countByRole(Role role);
}
