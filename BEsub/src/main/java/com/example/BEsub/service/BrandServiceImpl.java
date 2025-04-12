package com.example.BEsub.service;

import com.example.BEsub.dtos.BrandDTO;
import com.example.BEsub.models.Brand;
import com.example.BEsub.repositories.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService{
    @Autowired
    private BrandRepository brandRepository;

    public List<BrandDTO> getAllBrands() {
        return brandRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BrandDTO mapToDTO(Brand brand) {
        BrandDTO dto = new BrandDTO();
        dto.setId(brand.getId());
        dto.setName(brand.getName());
        dto.setLogoUrl(brand.getLogoUrl());
        return dto;
    }
}
