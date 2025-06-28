package com.jeongmin.backend.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "overpassApi",
        url = "https://overpass.kumi.systems"
)
public interface OverpassFeignClient {

    @GetMapping(value = "/api/interpreter", produces = "application/json")
    String fetchOverpassData(@RequestParam("data") String query);
}
