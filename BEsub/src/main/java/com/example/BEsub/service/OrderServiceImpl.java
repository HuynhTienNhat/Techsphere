package com.example.BEsub.service;

import com.example.BEsub.dtos.OrderCreateDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.dtos.OrderStatusChangeDTO;
import com.example.BEsub.enums.OrderStatus;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService{
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductVariantRepository productVariantRepository;

    @Autowired
    CartRepository cartRepository;

    @Override
    public List<OrderDTO> getAllOrdersOfUser() {
        User user = userRepository.findById(getCurrentUserId()).orElseThrow(()->new AppException("User not found"));
        List<Order> orders = user.getOrders();

        return orders.stream().map(this::mapToOrderDTO).toList();
    }

    @Override
    public List<OrderDTO> getAllOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(()->new AppException("User not found"));
        List<Order> orders = user.getOrders();

        return orders.stream().map(this::mapToOrderDTO).toList();
    }

    @Override
    public void changeStatusOfOrder(OrderStatusChangeDTO orderStatusChangeDTO) {
        User user = userRepository.findById(orderStatusChangeDTO.getUserId()).orElseThrow(()->new AppException("User not found"));
        List<Order> orders = user.getOrders();

        Order orderChange = orders.stream()
                .filter(o -> o.getId().equals(orderStatusChangeDTO.getOrderId()))
                .findFirst()
                .orElseThrow(()-> new AppException("Order not found"));

        orderChange.setStatus(OrderStatus.fromString(orderStatusChangeDTO.getStatus()));
        orderRepository.save(orderChange);
    }

    @Override
    public OrderDTO getOrder(Long orderId) {
        User user = userRepository.findById(getCurrentUserId()).orElseThrow(()->new AppException("User not found"));
        List<Order> orders = user.getOrders();

        Order order = orders.stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(()-> new AppException("Order not found"));

        return mapToOrderDTO(order);
    }

    @Override
    @Transactional
    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setDiscountAmount(orderCreateDTO.getDiscountAmount());
        order.setDiscountCode(orderCreateDTO.getDiscountCode());
        order.setStatus(OrderStatus.PROCESSING);
        order.setSubtotal(orderCreateDTO.getSubtotal());
        order.setShippingFee(orderCreateDTO.getShippingFee());
        order.setTotalAmount(order.caculateTotalAmount());
        order.setUser(userRepository.findById(getCurrentUserId()).orElseThrow(()->new AppException("User not found")));
        order.setAddress(orderCreateDTO.getUserAddress());

        Cart cart = cartRepository.findByUserId(getCurrentUserId())
                .orElseThrow(()->new AppException("User not found"));
        List<CartItem> cartItems = cart.getCartItems();
        for(CartItem item : cartItems){
            if (item.getQuantity() > item.getVariant().getStockQuantity()) {
                throw new AppException("Product " + item.getVariant().getProduct().getName() + " is not have enough stock");
            }
        }

        order.setOrderItems(cartItems.stream()
                .map((item)->mapCartItemToOrderItem(item,order))
                .toList());

        cartItems.clear();
        cartRepository.save(cart);

        orderRepository.save(order);

        for(CartItem item : cartItems){
            item.getVariant().setStockQuantity(item.getVariant().getStockQuantity()-item.getQuantity());
            productVariantRepository.save(item.getVariant());
        }


        return mapToOrderDTO(order);
    }

    @Override
    public void deleteOrder(Long orderId) {
        User user = userRepository.findById(getCurrentUserId())
                .orElseThrow(()->new AppException("User not found"));
        Order order = user.getOrders()
                .stream().filter((od)->od.getId().equals(orderId))
                .findFirst()
                .orElseThrow(()-> new AppException("Order not found"));
        if(order.getStatus().equals(OrderStatus.DELIVERED)) throw new AppException("Order was delivered");
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private OrderItem mapCartItemToOrderItem(CartItem cartItem, Order order){
        OrderItem orderItem = new OrderItem();
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setUnitPrice(cartItem.getUnitPrice());
        orderItem.setVariant(cartItem.getVariant());
        orderItem.setOrder(order);
        return orderItem;
    }

    private OrderDTO mapToOrderDTO(Order order){
        if (order == null) return null;

        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingFee(order.getShippingFee());
        dto.setDiscountCode(order.getDiscountCode());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        dto.setUserAddressId(order.getAddress() != null ? order.getAddress().getId() : null);
        dto.setOrderItems(order.getOrderItems());

        return dto;
    }

    public Order mapToOrder(OrderDTO dto) {
        if (dto == null) return null;

        Order order = new Order();
        order.setId(dto.getOrderId());
        order.setOrderDate(dto.getOrderDate());
        order.setSubtotal(dto.getSubtotal());
        order.setShippingFee(dto.getShippingFee());
        order.setDiscountCode(dto.getDiscountCode());
        order.setDiscountAmount(dto.getDiscountAmount());
        order.setTotalAmount(dto.getTotalAmount());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setStatus(dto.getStatus());

        order.setUser(userRepository.findById(dto.getUserId())
                .orElseThrow(()->new AppException("User not found")));

        Order orderToGetAddress = orderRepository.findById(dto.getOrderId())
                        .orElseThrow(()->new AppException("Order not found"));
        order.setAddress(orderToGetAddress.getAddress());

        // Thiết lập quan hệ ngược giữa OrderItem và Order
        if (dto.getOrderItems() != null) {
            for (OrderItem item : dto.getOrderItems()) {
                item.setOrder(order); // đảm bảo mối quan hệ 2 chiều
            }
            order.setOrderItems(dto.getOrderItems());
        }

        return order;
    }


    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Giả định username trong token là userId (hoặc lấy từ claims tùy cấu hình)
        return Long.valueOf(authentication.getName());
    }
}
