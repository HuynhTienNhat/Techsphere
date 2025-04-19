package com.example.BEsub.service;

import com.example.BEsub.dtos.OrderCreateDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.dtos.OrderStatusChangeDTO;
import com.example.BEsub.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    // Customer
    List<OrderDTO> getAllOrdersOfUser();
    OrderDTO getOrder(Long orderId);
    OrderDTO createOrder(OrderCreateDTO orderCreateDTO);
    List<OrderDTO> getOrdersByStatus(Long userId, OrderStatus status); // Lọc theo trạng thái với userId
    List<OrderDTO> getOrdersByMonthAndYear(Long userId, int month, int year); // Lọc theo tháng/năm với userId
    void cancelOrder(Long orderId);

    // Admin
    List<OrderDTO> getAllOrdersByUserId(Long userId);
    void changeStatusOfOrder(OrderStatusChangeDTO orderStatusChangeDTO);
    List<OrderDTO> getAllOrdersByStatus(OrderStatus status); // Lọc toàn bộ đơn hàng theo trạng thái
    List<OrderDTO> getAllOrdersByMonthAndYear(int month, int year); // Lọc toàn bộ đơn hàng theo tháng/năm
}
