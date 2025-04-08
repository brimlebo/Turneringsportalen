package com.turneringsportalen.backend.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
class SecurityConfig(private val jwtAuthFilter: JwtAuthFilter) {

    @Bean
    fun securityFilterChain(http: HttpSecurity) = http
        .csrf { it.disable() }
        .authorizeHttpRequests {

            //TODO handle all requests for: "event_organizer", "team_leader" and rest.
            it.requestMatchers(HttpMethod.PUT, "/tournaments/**").hasAuthority("event_organizer")
            it.requestMatchers(HttpMethod.DELETE, "/tournaments/**").hasAuthority("event_organizer")

            it.requestMatchers(HttpMethod.PUT, "/tournaments/create").hasAuthority("event_organizer")
            it.requestMatchers(HttpMethod.POST, "/tournaments/create").hasAuthority("event_organizer")

            it.requestMatchers("*/registration").hasAuthority("team_leader") // Team leaders can register for tournaments

            //it.requestMatchers("/tournaments/**").authenticated()  // Public endpoints

            it.anyRequest().permitAll()          // Secure everything else

        }

        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) } // Stateless authentication
        .build()
}
