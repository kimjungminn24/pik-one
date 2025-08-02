package com.jeongmin.backend.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GithubIssueFeignConfig {

    @Value("${github.token}")
    private String githubToken;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            template.header("Authorization", "Bearer " + githubToken);
            template.header("Accept", "application/vnd.github+json");
        };
    }
}
