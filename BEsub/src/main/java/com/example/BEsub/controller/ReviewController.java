package com.example.BEsub.controller;

import com.example.BEsub.dtos.ReviewCreateDTO;
import com.example.BEsub.dtos.ReviewDTO;
import com.example.BEsub.dtos.ReviewUpdateDTO;
import com.example.BEsub.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@PreAuthorize("hasRole('CUSTOMER')")
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @PostMapping
    ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewCreateDTO reviewCreateDTO){
        return ResponseEntity.status(HttpStatus.OK).body(reviewService.createReview(reviewCreateDTO));
    }

    @GetMapping
    ResponseEntity<List<ReviewDTO>> getReviewsOfUser(){
        return ResponseEntity.status(HttpStatus.OK).body(reviewService.getReviewsOfUser());
    }

    @PutMapping("/{reviewId}")
    ResponseEntity<ReviewDTO> updateReview(@PathVariable Long reviewId, @RequestBody ReviewUpdateDTO reviewUpdateDTO){
        return ResponseEntity.status(HttpStatus.OK).body(reviewService.updateReview(reviewId,reviewUpdateDTO));
    }

    @DeleteMapping("/{reviewId}")
    ResponseEntity<String> deleteReview(@PathVariable Long reviewId){
        reviewService.deleteReview(reviewId);
        return ResponseEntity.status(HttpStatus.OK).body("Delete review successfully");
    }
}
