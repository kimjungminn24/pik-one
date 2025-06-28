package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.LocationCheckRequest;
import com.jeongmin.backend.dto.LocationCheckResponse;
import com.jeongmin.backend.service.OverPassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
public class LocationController {

    private final OverPassService overPassService;

    @GetMapping("/check")
    public ResponseEntity<LocationCheckResponse> checkLocation(@ModelAttribute LocationCheckRequest request) throws Exception {
        LocationCheckResponse response = overPassService.checkLocationDecorTypes(request);
        return ResponseEntity.ok(response);
    }
}
