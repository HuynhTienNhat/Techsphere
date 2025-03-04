package com.phonestore.ts.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.phonestore.ts.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
	boolean existsByPhone(String phone);
	Optional<User> findByUsername(String username);
}
