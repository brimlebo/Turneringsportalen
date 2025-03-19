package com.turneringsportalen.backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.User
import org.springframework.stereotype.Component
import org.springframework.web.filter.GenericFilterBean

@Component
class JwtAuthFilter(private val jwtUtil: JwtUtil) : GenericFilterBean() {

    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val httpRequest = request as HttpServletRequest
        val authHeader = httpRequest.getHeader("Authorization")

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            if (jwtUtil.validateToken(token)) {
                val claims = jwtUtil.getClaims(token)
                val userEmail = claims.subject
                val authorities = listOf<GrantedAuthority>() // You can extract roles from the claims if needed
                val auth = UsernamePasswordAuthenticationToken(User(userEmail, "", authorities), null, authorities)
                SecurityContextHolder.getContext().authentication = auth
                println(authorities)
            }
        }

        chain.doFilter(request, response)
    }
}
