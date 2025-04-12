package com.example.BEsub.service;

import com.example.BEsub.dtos.AverageRatingDTO;
import com.example.BEsub.dtos.ReviewCreateDTO;
import com.example.BEsub.dtos.ReviewDTO;
import com.example.BEsub.dtos.ReviewUpdateDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;


public interface ReviewService {
    ReviewDTO createReview(ReviewCreateDTO reviewCreateDTO);
    List<ReviewDTO> getReviewsOfUser();
    ReviewDTO updateReview(Long reviewId, ReviewUpdateDTO reviewUpdateDTO);
    void deleteReview(Long reviewId);
}
