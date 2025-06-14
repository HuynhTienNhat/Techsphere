package com.example.BEsub.config;

import com.example.BEsub.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Cho phép tất cả truy cập login/register
                        .requestMatchers(HttpMethod.POST, "/api/users/login", "/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/brands").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/addresses").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/users/addresses").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/api/users/addresses/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/addresses/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/users/addresses/{addressId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users/profile").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/profile").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/products/brand/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/sort").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/by-brand").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/top-6-best-selling").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/top-6-new-products").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/brand/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/reset-password").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/users/password").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/cart").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/cart/items").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT, "/api/cart/items/**").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/cart/items/**").hasRole("CUSTOMER")

                        // Orders' endpoints
                        .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/{orderId}").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.POST, "/api/orders").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/status").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/orders/month-year").hasRole("CUSTOMER")
                        .requestMatchers(HttpMethod.GET, "/api/admin/orders/{userId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/admin/orders").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/admin/orders/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/admin/orders/month-year").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.GET, "/api/reviews/{productId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/reviews/{productId}/rating").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/otp").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/payment/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/otp").permitAll()
                        // Chỉ ADMIN được thêm sản phẩm
                        .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
                        // Chỉ ADMIN được cập nhật sản phẩm
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        // Chỉ ADMIN được xóa sản phẩm
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                        // Chỉ ADMIN được xem danh sách tất cả người dùng
                        .requestMatchers(HttpMethod.GET, "/api/admin/users").hasRole("ADMIN")
                        // Các request khác (GET) chỉ cần authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(List.of("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}