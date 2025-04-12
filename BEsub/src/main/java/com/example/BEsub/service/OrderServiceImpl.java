package com.example.BEsub.service;

import com.example.BEsub.dtos.OrderCreateDTO;
import com.example.BEsub.dtos.OrderDTO;
import com.example.BEsub.dtos.OrderItemDTO;
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
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ProductVariantRepository productVariantRepository;

    @Autowired
    CartRepository cartRepository;

    @Autowired
    UserAddressRepository addressRepository;

    @Override
    public List<OrderDTO> getAllOrdersOfUser() {
        User user = userRepository.findById(getCurrentUserId()).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        return orders.stream().map(this::mapToOrderDTO).toList();
    }

    @Override
    public List<OrderDTO> getAllOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        return orders.stream().map(this::mapToOrderDTO).toList();
    }

    @Override
    public void changeStatusOfOrder(OrderStatusChangeDTO orderStatusChangeDTO) {
        User user = userRepository.findById(orderStatusChangeDTO.getUserId()).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        Order orderChange = orders.stream()
                .filter(o -> o.getId().equals(orderStatusChangeDTO.getOrderId()))
                .findFirst()
                .orElseThrow(() -> new AppException("Order not found"));

        orderChange.setStatus(OrderStatus.fromString(orderStatusChangeDTO.getStatus()));
        orderRepository.save(orderChange);
    }



    @Override
    public OrderDTO getOrder(Long orderId) {
        User user = userRepository.findById(getCurrentUserId()).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        Order order = orders.stream()
                .filter(o -> o.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new AppException("Order not found"));

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

        // Lấy thông tin người dùng
        order.setUser(userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new AppException("User not found")));

        // Lấy địa chỉ người dùng
        UserAddress address = addressRepository.findById(orderCreateDTO.getUserAddressId())
                .orElseThrow(() -> new AppException("Address not found"));
        order.setAddress(address);

        // Lưu đơn hàng vào cơ sở dữ liệu
        orderRepository.save(order);

        // Lấy giỏ hàng của người dùng
        Cart cart = cartRepository.findByUserId(getCurrentUserId())
                .orElseThrow(() -> new AppException("Cart not found"));

        // Kiểm tra tồn kho các sản phẩm trong giỏ hàng
        for (CartItem item : cart.getCartItems()) {
            if (item.getQuantity() > item.getVariant().getStockQuantity()) {
                throw new AppException("Product " + item.getVariant().getProduct().getName() + " is out of stock");
            }
        }

        // Chuyển đổi từ CartItem sang OrderItem và lưu vào đơn hàng
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(item -> mapCartItemToOrderItem(item, order))
                .collect(Collectors.toList());
        order.setOrderItems(orderItems);

        // Xóa giỏ hàng sau khi đã tạo đơn hàng
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // Cập nhật số lượng tồn kho của các sản phẩm
        for (CartItem item : cart.getCartItems()) {
            item.getVariant().setStockQuantity(item.getVariant().getStockQuantity() - item.getQuantity());
            productVariantRepository.save(item.getVariant());
        }

        // Trả về DTO của đơn hàng
        return mapToOrderDTO(order);
    }


    @Override
    public void deleteOrder(Long orderId) {
        User user = userRepository.findById(getCurrentUserId())
                .orElseThrow(() -> new AppException("User not found"));
        Order order = user.getOrders()
                .stream().filter((od) -> od.getId().equals(orderId))
                .findFirst()
                .orElseThrow(() -> new AppException("Order not found"));
        if (order.getStatus().equals(OrderStatus.DELIVERED)) throw new AppException("Order was delivered");
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    private OrderItem mapCartItemToOrderItem(CartItem cartItem, Order order) {
        OrderItem orderItem = new OrderItem();
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setUnitPrice(cartItem.getUnitPrice());
        orderItem.setVariant(cartItem.getVariant());
        orderItem.setOrder(order);
        return orderItem;
    }

    private OrderDTO mapToOrderDTO(Order order) {
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
        dto.setOrderItems(order.getOrderItems().stream().map(this::mapToOrderItemDTO).toList());

        return dto;
    }

    private OrderItem mapToOrderItem(OrderItemDTO orderItemDTO, Order order){
        return OrderItem.builder()
                .quantity(orderItemDTO.getQuantity())
                .unitPrice(orderItemDTO.getUnitPrice())
                .order(order)
                .variant(productVariantRepository.findById(orderItemDTO.getVariantId()).orElseThrow(()->new AppException("Variant not found")))
                .build();
    }

    public OrderItemDTO mapToOrderItemDTO(OrderItem orderItem){
        OrderItemDTO orderItemDTO = new OrderItemDTO();

        orderItemDTO.setQuantity(orderItem.getQuantity());
        orderItemDTO.setColor(orderItem.getVariant().getColor());
        orderItemDTO.setStorage(orderItem.getVariant().getStorage());
        orderItemDTO.setProductName(orderItem.getVariant().getProduct().getName());
        orderItemDTO.setVariantId(orderItem.getVariant().getId());
        orderItemDTO.setUnitPrice(orderItem.getUnitPrice());

        return orderItemDTO;
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
                .orElseThrow(() -> new AppException("User not found")));

        Order orderToGetAddress = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new AppException("Order not found"));
        order.setAddress(orderToGetAddress.getAddress());

        if (dto.getOrderItems() != null) {
            List<OrderItemDTO> orderItemDTOS = dto.getOrderItems();
            List<OrderItem> orderItems = orderItemDTOS.stream().map((item)->mapToOrderItem(item,order)).toList();
            order.setOrderItems(orderItems);
        }

        return order;
    }


    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()->new AppException("User not found"))
                .getId();
    }
}
