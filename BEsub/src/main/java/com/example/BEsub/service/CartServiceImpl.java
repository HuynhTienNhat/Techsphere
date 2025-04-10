package com.example.BEsub.service;

import com.example.BEsub.dtos.*;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.*;
import com.example.BEsub.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CartDTO getCartByUser() {
        Long userId = getCurrentUserId();
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException("Cart not found for user"));
        return mapToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartItemDTO addToCart(Long variantId, Integer quantity) {
        Long userId = getCurrentUserId();
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(userId));

        ProductVariant variant = productVariantRepository.findById(variantId)
                .orElseThrow(() -> new AppException("Product variant not found"));

        // Tính unitPrice = basePrice + priceAdjustment
        BigDecimal unitPrice = variant.getProduct().getBasePrice().add(variant.getPriceAdjustment());

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setVariant(variant);
        cartItem.setQuantity(quantity != null && quantity > 0 ? quantity : 1); // Mặc định quantity = 1
        cartItem.setUnitPrice(unitPrice);

        cart.getCartItems().add(cartItem);
        cartItemRepository.save(cartItem);

        return mapToCartItemDTO(cartItem);
    }

    @Override
    @Transactional
    public CartItemDTO updateCartItemQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException("Cart item not found"));

        // Kiểm tra user hiện tại sở hữu cartItem
        Long userId = getCurrentUserId();
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new AppException("You do not have permission to update this cart item");
        }

        // Đảm bảo quantity tối thiểu là 1
        if (quantity < 1) {
            throw new AppException("Quantity must be at least 1");
        }
        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        return mapToCartItemDTO(cartItem);
    }

    @Override
    @Transactional
    public void removeCartItem(Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException("Cart item not found"));

        // Kiểm tra quyền sở hữu
        Long userId = getCurrentUserId();
        if (!cartItem.getCart().getUser().getId().equals(userId)) {
            throw new AppException("You do not have permission to remove this cart item");
        }

        cartItem.getCart().getCartItems().remove(cartItem); // Xóa khỏi danh sách
        cartItemRepository.delete(cartItem); // Xóa khỏi DB
    }

    // Helper methods
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Giả định username trong token là userId (hoặc lấy từ claims tùy cấu hình)
        return Long.valueOf(authentication.getName());
    }

    private Cart createNewCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found"));
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private CartDTO mapToCartDTO(Cart cart) {
        List<CartItemDTO> cartItems = cart.getCartItems().stream()
                .map(this::mapToCartItemDTO)
                .collect(Collectors.toList());

        // Tính totalPrice
        BigDecimal totalPrice = cartItems.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDTO(cart.getId(), cart.getUser().getId(), cartItems, totalPrice);
    }

    private CartItemDTO mapToCartItemDTO(CartItem cartItem) {
        return new CartItemDTO(
                cartItem.getId(),
                cartItem.getVariant().getId(),
                cartItem.getVariant().getProduct().getName(),
                cartItem.getVariant().getColor(),
                cartItem.getVariant().getStorage(),
                cartItem.getQuantity(),
                cartItem.getUnitPrice()
        );
    }
}
