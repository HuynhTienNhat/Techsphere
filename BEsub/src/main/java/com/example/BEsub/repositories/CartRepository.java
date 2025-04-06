package com.example.BEsub.repositories;

import com.example.BEsub.models.Cart;
import com.example.BEsub.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

}
