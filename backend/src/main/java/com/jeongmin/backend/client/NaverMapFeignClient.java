package com.jeongmin.backend.client;

import com.jeongmin.backend.config.NaverMapFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "naverMapClient",
        url = "https://map.naver.com",
        configuration = NaverMapFeignConfig.class
)
public interface NaverMapFeignClient {

    @GetMapping(
            value = "/p/api/place/summary/{placeId}",
            consumes = "application/json"
    )
    String getPlaceSummary(@PathVariable("placeId") Long placeId);

    @GetMapping(
            value = "/p/api/pubtrans/bus/stops/{stopId}",
            consumes = "application/json"
    )
    String getBusStopInfo(@PathVariable("stopId") Long stopId);

    @GetMapping(
            value = "/p/api/pubtrans/subway/station/{stationId}",
            consumes = "application/json"
    )
    String getSubwayStationInfo(@PathVariable("stationId") Long stationId);
}
