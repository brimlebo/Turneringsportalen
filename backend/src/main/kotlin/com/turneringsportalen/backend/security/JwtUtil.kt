package com.turneringsportalen.backend.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.security.Key
import java.util.*

@Component
class JwtUtil(
    @Value("\${supabase.jwt.secret}") private val secretKey: String,
    @Value("\${supabase.jwt.issuer}") private val issuer: String
) {

    private fun getSigningKey(): Key {
        return Keys.hmacShaKeyFor(secretKey.toByteArray(StandardCharsets.UTF_8))
    }

    fun validateToken(token: String): Boolean {
        return try {
            val claims = getClaims(token)
            claims.issuer == issuer && claims.expiration.after(Date())
        } catch (e: Exception) {
            false
        }
    }

    fun getClaims(token: String): Claims {
        return Jwts.parser()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .body
    }
}
