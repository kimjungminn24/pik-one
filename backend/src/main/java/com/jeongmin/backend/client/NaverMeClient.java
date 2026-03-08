package com.jeongmin.backend.client;

import com.jeongmin.backend.config.NaverMeFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "naverMeClient",
        url = "https://naver.me",
        configuration = NaverMeFeignConfig.class
)
public interface NaverMeClient {

    @GetMapping("/{code}")
    ResponseEntity<Void> resolve(@PathVariable("code") String code);
}
