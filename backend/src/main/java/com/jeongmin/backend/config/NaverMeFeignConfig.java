package com.jeongmin.backend.config;

import feign.FeignException;
import feign.Request;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NaverMeFeignConfig {

    @Bean
    public Request.Options feignOptions() {
        return new Request.Options(
                5_000,
                5_000,
                false
        );
    }

    @Bean
    public ErrorDecoder naverMeErrorDecoder() {
        return (methodKey, response) -> {
            int status = response.status();

            if (status == 301 || status == 302 || status == 307 || status == 308) {
                return FeignException.errorStatus(methodKey, response);
            }

            return new ErrorDecoder.Default().decode(methodKey, response);
        };
    }
}
