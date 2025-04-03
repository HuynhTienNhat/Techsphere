package com.example.BEsub.service;

import com.example.BEsub.models.Product;
import com.example.BEsub.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
}
