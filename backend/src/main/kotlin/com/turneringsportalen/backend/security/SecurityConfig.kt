package com.turneringsportalen.backend.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
class SecurityConfig(private val jwtAuthFilter: JwtAuthFilter) {

    @Bean
    fun securityFilterChain(http: HttpSecurity) = http
        .csrf { it.disable() }
        .authorizeHttpRequests {
            it.requestMatchers("/tournaments/**").authenticated()  // Public endpoints
            it.anyRequest().permitAll()          // Secure everything else
        }
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) } // Stateless authentication
        .build()
}
