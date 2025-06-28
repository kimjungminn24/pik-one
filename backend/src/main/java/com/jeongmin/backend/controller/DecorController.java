package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.DecorCreateRequest;
import com.jeongmin.backend.dto.DecorResponse;
import com.jeongmin.backend.dto.DecorSearchRequest;
import com.jeongmin.backend.service.DecorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ResponseEntity<DecorResponse> postDecor(@RequestBody DecorCreateRequest request) {
        DecorResponse response = decorService.createNewDecor(request);
        return ResponseEntity.ok(response);
    }
}
