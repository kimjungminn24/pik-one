package com.jeongmin.backend.config;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NaverMapFeignConfig {

    @Bean
    public RequestInterceptor naverMapRequestInterceptor() {
        return requestTemplate -> {
            requestTemplate.header(
                    "User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            );
            requestTemplate.header(
                    "Referer",
                    "https://map.naver.com/"
            );
            requestTemplate.header(
                    "Accept",
                    "application/json"
            );
        };
    }

    @Bean
    public ErrorDecoder naverMapErrorDecoder() {
        return (methodKey, response) -> {
            return new RuntimeException(
                    "Feign error: status=" + response.status()
            );
        };
    }
}
