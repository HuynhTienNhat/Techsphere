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

import java.io.Console;
import java.math.BigDecimal;
import java.util.Comparator;
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

        boolean exists = cart.getCartItems().stream()
                .anyMatch(item -> item.getVariant().getId().equals(variantId));

        if (exists) {
            throw new AppException("Sản phẩm đã tồn tại trong giỏ");
        }

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
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()->new AppException("User not found"))
                .getId();
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

    private CartItem mapToCartItem(CartItemDTO cartItemDTO, Cart cart){
        CartItem cartItem =  new CartItem();
        cartItem.setVariant(productVariantRepository.findById(cartItemDTO.getVariantId())
                .orElseThrow(()->new AppException("Variant not found")));
        cartItem.setQuantity(cartItemDTO.getQuantity());
        cartItem.setUnitPrice(cartItemDTO.getUnitPrice());
        cartItem.setCart(cart);
        return cartItem;
    }

    private CartItemDTO mapToCartItemDTO(CartItem cartItem) {
        String mainImageUrl = null;
        if (cartItem.getVariant().getProduct().getImages() != null && !cartItem.getVariant().getProduct().getImages().isEmpty()) {
            mainImageUrl = cartItem.getVariant().getProduct().getImages().stream()
                    .min(Comparator.comparing(ProductImage::getDisplayOrder))
                    .map(ProductImage::getImgUrl)
                    .orElse(null);
        }
        return new CartItemDTO(
                cartItem.getId(),
                cartItem.getVariant().getId(),
                cartItem.getVariant().getProduct().getName(),
                cartItem.getVariant().getColor(),
                cartItem.getVariant().getStorage(),
                cartItem.getQuantity(),
                cartItem.getUnitPrice(),
                cartItem.getVariant().getProduct().getBasePrice(),
                cartItem.getVariant().getProduct().getOldPrice(),
                mainImageUrl,
                cartItem.getVariant().getProduct().getSlug()
        );
    }
}
