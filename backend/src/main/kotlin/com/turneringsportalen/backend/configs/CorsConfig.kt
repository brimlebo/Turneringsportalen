import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig {

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowedOrigins = listOf("http://localhost:3000") // Allow frontend
        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all needed methods
        config.allowedHeaders = listOf("*") // Allow all headers
        config.allowCredentials = true // Allow credentials (if needed)
        config.maxAge = 3600L // Cache preflight for 1 hour
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}
