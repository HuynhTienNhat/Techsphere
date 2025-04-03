package com.example.BEsub.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.*;

@Configuration
public class ModelMapperConfig {
    // This class can be used to configure ModelMapper beans if needed
    // Currently, it is empty but can be extended in the future
    // to include custom mappings or settings for ModelMapper
    // For example, you can define a ModelMapper bean here:
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.getConfiguration()
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setSkipNullEnabled(true);

        return modelMapper;
    }
}
