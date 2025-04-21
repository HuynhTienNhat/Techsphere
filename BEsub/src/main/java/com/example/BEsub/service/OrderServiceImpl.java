package com.example.BEsub.service;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.example.BEsub.dtos.*;
import com.example.BEsub.enums.OrderStatus;
import com.example.BEsub.enums.Role;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
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

    @Autowired
    ProductRepository productRepository;

    @Override
    @Transactional
    public OrderDTO createOrder(OrderCreateDTO orderCreateDTO) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setDiscountAmount(orderCreateDTO.getDiscountAmount());
        order.setDiscountCode(orderCreateDTO.getDiscountCode());
        order.setStatus(OrderStatus.CONFIRMING);
        order.setSubtotal(orderCreateDTO.getSubtotal());
        order.setPaymentMethod(orderCreateDTO.getPaymentMethod());
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

        // Kiểm tra và thu thập ProductVariant cần cập nhật
        List<ProductVariant> variantsToUpdate = new ArrayList<>();
        for (CartItem item : cart.getCartItems()) {
            ProductVariant variant = item.getVariant();
            if (item.getQuantity() > variant.getStockQuantity()) {
                throw new AppException("Product " + variant.getProduct().getName() + " is out of stock");
            }
            variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
            variantsToUpdate.add(variant);
        }

        // Lưu tất cả ProductVariant
        productVariantRepository.saveAll(variantsToUpdate);

        // Chuyển đổi từ CartItem sang OrderItem
        List<OrderItem> orderItems = cart.getCartItems().stream()
                .map(item -> mapCartItemToOrderItem(item, order))
                .collect(Collectors.toList());
        order.setOrderItems(orderItems);

        // Xóa giỏ hàng
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // Trả về DTO của đơn hàng
        return mapToOrderDTO(order);
    }

    @Override
    public List<Integer> getDistinctOrderYears() {
        return orderRepository.findDistinctOrderYears();
    }

    @Override
    public DashboardInformationDTO getDashboardInformation(int year) {
        DashboardInformationDTO informationDTO = new DashboardInformationDTO();
        try {
            BigDecimal customers = userRepository.countByRole(Role.CUSTOMER);
            informationDTO.setCustomers(customers);

            BigDecimal newOrders = orderRepository.countByStatus(OrderStatus.CONFIRMING);
            informationDTO.setNewOrders(newOrders);

            informationDTO.setProducts(BigDecimal.valueOf(productVariantRepository.count()));

            List<Order> orders = orderRepository.findTop3LatestOrders();
            informationDTO.setRecentOrders(orders != null ? orders.stream().map(this::mapToDashboardOrderDTO).toList() : new ArrayList<>());

            List<Order> ordersByYear = orderRepository.findAllByYear(year);
            List<ChartDataDTO> defaultChartData = new ArrayList<>();
            List<BigDecimal> revenues = getRevenues(ordersByYear);
            for (int i = 1; i <= 12; i++) {
                defaultChartData.add(new ChartDataDTO("Tháng " + i, revenues.get(i-1)));
            }
            informationDTO.setOrdersCompletedByYear(ordersByYear != null ? defaultChartData : new ArrayList<>());

            BigDecimal totalRevenue = revenues.stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            informationDTO.setTotalRevenue(totalRevenue);
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return informationDTO;
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "orderDate"));
        return orders.stream()
                .map(this::mapToOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getAllOrdersOfUser() {
        User user = userRepository.findById(getCurrentUserId()).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        return orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate, Comparator.reverseOrder()))
                .map(this::mapToOrderDTO)
                .toList();
    }

    @Override
    public List<OrderDTO> getAllOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        return orders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate, Comparator.reverseOrder()))
                .map(this::mapToOrderDTO)
                .toList();
    }

    @Override
    public void changeStatusOfOrder(OrderStatusChangeDTO orderStatusChangeDTO) {
        User user = userRepository.findById(orderStatusChangeDTO.getUserId()).orElseThrow(() -> new AppException("User not found"));
        List<Order> orders = user.getOrders();

        Order orderChange = orders.stream()
                .filter(o -> o.getId().equals(orderStatusChangeDTO.getOrderId()))
                .findFirst()
                .orElseThrow(() -> new AppException("Order not found"));

        OrderStatus newStatus = OrderStatus.fromString(orderStatusChangeDTO.getStatus());
        if (newStatus == OrderStatus.COMPLETED && orderChange.getStatus() != OrderStatus.COMPLETED) {
            for (OrderItem item : orderChange.getOrderItems()) {
                Product product = item.getVariant().getProduct();
                product.setSales(product.getSales() + item.getQuantity());
                productRepository.save(product);
            }
        }

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
    public List<OrderDTO> getOrdersByStatus(Long userId, OrderStatus status) {
        Sort sort = Sort.by(Sort.Direction.DESC, "orderDate");
        List<Order> orders = orderRepository.findByUserIdAndStatus(userId, status, sort);
        return orders.stream()
                .map(this::mapToOrderDTO)
                .toList();
    }

    @Override
    public List<OrderDTO> getOrdersByMonthAndYear(Long userId, int month, int year) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);
        Sort sort = Sort.by(Sort.Direction.DESC, "orderDate");
        List<Order> orders = orderRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate, sort);
        return orders.stream()
                .map(this::mapToOrderDTO)
                .toList();
    }

    @Override
    public List<OrderDTO> getAllOrdersByStatus(OrderStatus status) {
        Sort sort = Sort.by(Sort.Direction.DESC, "orderDate");
        List<Order> orders = orderRepository.findByStatus(status, sort);
        return orders.stream()
                .map(this::mapToOrderDTO)
                .toList();
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId) {
        Long userId = getCurrentUserId();
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new AppException("Order not found"));

        if (order.getStatus() != OrderStatus.CONFIRMING && order.getStatus() != OrderStatus.PREPARING) {
            throw new AppException("Cannot cancel order. Only orders in CONFIRMING or PREPARING status can be cancelled.");
        }

        // Hoàn lại số lượng tồn kho
        List<ProductVariant> variantsToUpdate = new ArrayList<>();
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            variantsToUpdate.add(variant);
        }
        productVariantRepository.saveAll(variantsToUpdate);

        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }

    @Override
    public List<OrderDTO> getAllOrdersByMonthAndYear(int month, int year) {
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime endDate = startDate.plusMonths(1).minusSeconds(1);
        Sort sort = Sort.by(Sort.Direction.DESC, "orderDate");
        List<Order> orders = orderRepository.findByOrderDateBetween(startDate, endDate, sort);
        return orders.stream()
                .map(this::mapToOrderDTO)
                .toList();
    }

    private OrderItem mapCartItemToOrderItem(CartItem cartItem, Order order) {
        OrderItem orderItem = new OrderItem();
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setUnitPrice(cartItem.getUnitPrice());
        orderItem.setVariant(cartItem.getVariant());
        orderItem.setOrder(order);
        return orderItem;
    }

    private DashboardOrderDTO mapToDashboardOrderDTO(Order order){
        DashboardOrderDTO orderDTO = new DashboardOrderDTO();
        orderDTO.setOrderDate(order.getOrderDate());
        orderDTO.setOrderId(order.getId());
        orderDTO.setStatus(order.getStatus());
        orderDTO.setTotalAmount(order.getTotalAmount());
        return orderDTO;
    }

    private List<BigDecimal> getRevenues(List<Order> orders) {
        List<BigDecimal> monthlyRevenues = new ArrayList<>(Collections.nCopies(12, BigDecimal.ZERO));

        for (Order order : orders) {
            if (order.getOrderDate() != null && order.getTotalAmount() != null && order.getStatus().equals(OrderStatus.COMPLETED)) {
                int month = order.getOrderDate().getMonthValue();
                BigDecimal currentRevenue = monthlyRevenues.get(month - 1);
                monthlyRevenues.set(month - 1, currentRevenue.add(order.getTotalAmount()));
            }
        }

        return monthlyRevenues;
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

    private OrderItem mapToOrderItem(OrderItemDTO orderItemDTO, Order order) {
        return OrderItem.builder()
                .quantity(orderItemDTO.getQuantity())
                .unitPrice(orderItemDTO.getUnitPrice())
                .order(order)
                .variant(productVariantRepository.findById(orderItemDTO.getVariantId()).orElseThrow(() -> new AppException("Variant not found")))
                .build();
    }

    public OrderItemDTO mapToOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO orderItemDTO = new OrderItemDTO();

        orderItemDTO.setQuantity(orderItem.getQuantity());
        orderItemDTO.setColor(orderItem.getVariant().getColor());
        orderItemDTO.setStorage(orderItem.getVariant().getStorage());
        orderItemDTO.setProductName(orderItem.getVariant().getProduct().getName());
        orderItemDTO.setVariantId(orderItem.getVariant().getId());
        orderItemDTO.setUnitPrice(orderItem.getUnitPrice());
        orderItemDTO.setProductId(orderItem.getVariant().getProduct().getId());

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
            List<OrderItem> orderItems = orderItemDTOS.stream().map((item) -> mapToOrderItem(item, order)).toList();
            order.setOrderItems(orderItems);
        }

        return order;
    }

    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException("User not found"))
                .getId();
    }
}