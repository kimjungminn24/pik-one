package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.FeedbackCreateRequest;
import com.jeongmin.backend.dto.FeedbackDto;
import com.jeongmin.backend.dto.FeedbackResponse;
import com.jeongmin.backend.facade.FeedbackFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackFacade feedbackFacade;

    @GetMapping("/me")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedbacks() {
        List<FeedbackResponse> response = feedbackFacade.getMyFeedbacks();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<FeedbackDto> postFeedback(@RequestBody FeedbackCreateRequest request) {
        FeedbackDto response = feedbackFacade.createFeedback(request);
        return ResponseEntity.ok(response);
    }

}
