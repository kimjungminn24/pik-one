package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.CoordinateDto;
import com.jeongmin.backend.dto.LocationCheckRequest;
import com.jeongmin.backend.dto.LocationCheckResponse;
import com.jeongmin.backend.service.LocationService;
import com.jeongmin.backend.service.OverPassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
public class LocationController {

    private final OverPassService overPassService;
    private final LocationService locationService;

    @GetMapping("/check")
    public ResponseEntity<LocationCheckResponse> checkLocation(@ModelAttribute LocationCheckRequest request) throws Exception {
        LocationCheckResponse response = overPassService.checkLocationDecorTypes(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/resolve")
    public ResponseEntity<CoordinateDto> resolveLocationFromLink(@RequestParam String url) throws Exception {
        CoordinateDto res = locationService.parse(url);
        return ResponseEntity.ok(res);
    }
}
