package com.turneringsportalen.backend.configs

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment

@Configuration
class SupabaseConfig(private val env: Environment) {

    @Bean
    fun client(): SupabaseClient {
        val supabaseUrl = env.getProperty("SUPABASE_URL") ?: throw RuntimeException("SUPABASE_URL not set")
        val supabaseKey = env.getProperty("SUPABASE_KEY") ?: throw RuntimeException("SUPABASE_KEY not set")

        return createSupabaseClient(
            supabaseUrl = supabaseUrl,
            supabaseKey = supabaseKey
        ) {
            install(Postgrest)
        }
    }
}
