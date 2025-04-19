package com.example.BEsub.repositories;

import com.example.BEsub.enums.OrderStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.BEsub.models.Order;

import java.math.BigDecimal;
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
    BigDecimal countByStatus(OrderStatus status);

    @Query(value = "SELECT DISTINCT YEAR(order_date) FROM orders ORDER BY YEAR(order_date) DESC", nativeQuery = true)
    List<Integer> findDistinctOrderYears();

    @Query(value = "SELECT * FROM orders WHERE YEAR(order_date) = :year", nativeQuery = true)
    List<Order> findAllByYear(@Param("year") int year);

    @Query(value = "SELECT * FROM orders ORDER BY order_date DESC LIMIT 3", nativeQuery = true)
    List<Order> findTop3LatestOrders();

    @Query(value = "SELECT SUM(total_amount) FROM orders WHERE YEAR(order_date) = :year", nativeQuery = true)
    BigDecimal getTotalRevenueByYear(@Param("year") int year);

}
