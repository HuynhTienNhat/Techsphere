package com.example.BEsub.service;

import com.example.BEsub.dtos.OrderCreateDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.dtos.OrderStatusChangeDTO;

import java.util.List;


public interface OrderService {
    List<OrderDTO> getAllOrdersOfUser();
    OrderDTO getOrder(Long orderId);
    OrderDTO createOrder(OrderCreateDTO orderCreateDTO);
    void deleteOrder(Long orderId);
    List<OrderDTO> getAllOrdersByUserId(Long userId);
    void changeStatusOfOrder(OrderStatusChangeDTO orderStatusChangeDTO);

}
