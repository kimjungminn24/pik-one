package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.*;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDecor(@PathVariable("id") Long decorId) {
        decorService.deleteDecor(decorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DecorDetailResponse> getDecor(@PathVariable("id") Long decorId) {
        DecorDetailResponse response = decorService.getDecorById(decorId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/feedback")
    public ResponseEntity<FeedbackDto> postFeedback(@RequestBody FeedbackCreateRequest request) {
        FeedbackDto response = decorService.createNewFeedback(request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/me")
    public ResponseEntity<List<DecorDetailResponse>> getMyDecors() {
        List<DecorDetailResponse> response = decorService.getMyDecors();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/feedbacks")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedbacks() {
        List<FeedbackResponse> response = decorService.getMyFeedback();
        return ResponseEntity.ok(response);
    }

}
