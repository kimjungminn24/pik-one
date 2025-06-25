package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.DecorResponse;
import com.jeongmin.backend.dto.DecorSearchRequest;
import com.jeongmin.backend.service.DecorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/decors")
@RequiredArgsConstructor
public class DecorController {
    private final DecorService decorService;

    @GetMapping("/search")
    public ResponseEntity<List<DecorResponse>> getDecorList(@ModelAttribute DecorSearchRequest request) {
        List<DecorResponse> response = decorService.searchDecorInBoundary(request);
        return ResponseEntity.ok(response);
    }

}
