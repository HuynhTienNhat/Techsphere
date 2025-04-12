package com.example.BEsub.service;

import com.example.BEsub.dtos.ReviewCreateDTO;
import com.example.BEsub.dtos.ReviewDTO;
import com.example.BEsub.dtos.ReviewUpdateDTO;
import com.example.BEsub.exception.AppException;
import com.example.BEsub.models.Review;
import com.example.BEsub.models.User;
import com.example.BEsub.repositories.OrderRepository;
import com.example.BEsub.repositories.ProductRepository;
import com.example.BEsub.repositories.ReviewRepository;
import com.example.BEsub.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService{
    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    public ReviewDTO createReview(ReviewCreateDTO reviewCreateDTO) {
        Review review = mapReviewCreateDTOToReview(reviewCreateDTO);
        reviewRepository.save(review);
        return mapReviewToReviewDTO(review);
    }

    @Override
    public List<ReviewDTO> getReviewsOfUser() {
        return reviewRepository.findByUserId(getCurrentUserId()).stream()
                .map(this::mapReviewToReviewDTO)
                .toList();
    }

    @Override
    public ReviewDTO updateReview(Long reviewId, ReviewUpdateDTO reviewUpdateDTO) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(()->new AppException("Review not found"));
        if(!Objects.equals(review.getUser().getId(), getCurrentUserId())) throw new AppException("You do not have permission to update this review.");
        review.setComment(reviewUpdateDTO.getComment());
        review.setRating(reviewUpdateDTO.getRating());

        reviewRepository.save(review);
        return mapReviewToReviewDTO(review);
    }

    @Override
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(()->new AppException("Review not found"));
        if(!Objects.equals(review.getUser().getId(), getCurrentUserId())) throw new AppException("You do not have permission to delete this review.");
        reviewRepository.delete(review);
    }

    private ReviewDTO mapReviewToReviewDTO(Review review){
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setCreatedAt(LocalDateTime.now());
        reviewDTO.setComment(review.getComment());
        reviewDTO.setUserId(getCurrentUserId());
        reviewDTO.setUsername(review.getUser().getUsername());
        reviewDTO.setId(review.getId());
        reviewDTO.setRating(review.getRating());
        return reviewDTO;
    }

    private Review mapReviewCreateDTOToReview(ReviewCreateDTO reviewCreateDTO){
        Review review = new Review();
        review.setComment(reviewCreateDTO.getComment());
        review.setUser(userRepository.findById(getCurrentUserId())
                .orElseThrow(()->new AppException("User not found")));
        review.setRating(reviewCreateDTO.getRating());
        review.setCreatedAt(LocalDateTime.now());
        review.setOrder(orderRepository.findById(reviewCreateDTO.getOrderId())
                .orElseThrow(()->new AppException("Order not found")));
        review.setProduct(productRepository.findById(reviewCreateDTO.getProductId())
                .orElseThrow(()->new AppException("Product not found")));
        return review;
    }

    // Helper methods
    private Long getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(()->new AppException("User not found"))
                .getId();
    }
}
