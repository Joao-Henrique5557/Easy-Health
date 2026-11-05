package br.com.easyhealth.config;

import java.util.Arrays;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig {
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    WebMvcConfigurer corsConfigurer(@Value("${app.cors-origins:*}") @NonNull String origins) {
        String[] allowedOrigins = parseAllowedOrigins(origins);

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("Authorization", "Content-Type", "X-Access-Token");
            }
        };
    }

    @NonNull
    private static String[] parseAllowedOrigins(@NonNull String origins) {
        return Objects.requireNonNull(Arrays.stream(origins.split(","))
                .map((@NonNull String origin) -> origin.trim())
                .filter(origin -> !origin.isEmpty())
                .toArray(String[]::new));
    }
}
