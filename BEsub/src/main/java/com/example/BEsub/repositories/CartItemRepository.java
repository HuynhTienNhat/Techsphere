package com.example.BEsub.repositories;

import com.example.BEsub.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    // Hiện tại chưa cần query đặc biệt, chỉ dùng các phương thức mặc định của JpaRepository
}