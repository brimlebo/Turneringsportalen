package com.turneringsportalen.backend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletRequest
import jakarta.servlet.ServletResponse
import jakarta.servlet.http.HttpServletRequest
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
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
                val userID = claims.subject
                val userEmail = claims["email"] as? String

                val userMetadata = claims["user_metadata"] as? Map<String, Any> ?: emptyMap()
                val username = userMetadata["username"] as? String
                val userrole = userMetadata["userrole"] as? String


                //val authorities = listOf<GrantedAuthority>() // You can extract roles from the claims if needed
                val authorities = listOf<GrantedAuthority>(SimpleGrantedAuthority(userrole))
                //val authority = userMetadata["authority"] as? String
                //UserDetails(userID, userEmail, userMetadata, authorities)
                //val authorities = mutableListOf<GrantedAuthority>()
                //userrole?.let { authorities.add(SimpleGrantedAuthority("ROLE_$it")) } // Prefix with "ROLE_"

                //val customUserDetails = CustomUserDetails(userID, userEmail, username, userrole, authorities)
                val auth = UsernamePasswordAuthenticationToken(User(userID, "", authorities), null, authorities)
                //val auth = UsernamePasswordAuthenticationToken(customUserDetails, null, authorities)

                println("Auth: ${auth}")
                SecurityContextHolder.getContext().authentication = auth
                println("SecurityContextHolder: ${SecurityContextHolder.getContext()}")

                println("UserID: ${userID}")
                println("Email: ${userEmail}")
                println("Username: ${username}")
                println("Userrole: ${userrole}")
            }
        }

        chain.doFilter(request, response)
    }
}
