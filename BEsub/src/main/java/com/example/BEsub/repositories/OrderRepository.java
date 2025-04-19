package com.example.BEsub.repositories;

import com.example.BEsub.enums.OrderStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.BEsub.models.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status, Sort sort);
    List<Order> findByUserIdAndOrderDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate, Sort sort);
    List<Order> findByStatus(OrderStatus status, Sort sort);
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate, Sort sort);
    Optional<Order> findByIdAndUserId(Long orderId, Long userId);
    List<Order> findAll(Sort sort);
}
