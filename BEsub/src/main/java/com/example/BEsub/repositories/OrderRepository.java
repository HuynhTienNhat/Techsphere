package com.example.BEsub.repositories;

import com.example.BEsub.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.BEsub.models.Order;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
    List<Order> findByUserIdAndOrderDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    Optional<Order> findByIdAndUserId(Long orderId, Long userId);

    @Query(value = "SELECT * FROM orders ORDER BY order_date DESC LIMIT 3", nativeQuery = true)
    List<Order> findTop3LatestOrders();

    @Query(value = "SELECT * FROM orders WHERE YEAR(order_date) = :year", nativeQuery = true)
    List<Order> findOrdersByYear(int year);
}
