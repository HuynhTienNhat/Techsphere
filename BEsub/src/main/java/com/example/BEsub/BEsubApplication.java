package com.example.BEsub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@EnableJpaRepositories
@SpringBootApplication
public class BEsubApplication {

	public static void main(String[] args) {
		SpringApplication.run(BEsubApplication.class, args);
	}

}
