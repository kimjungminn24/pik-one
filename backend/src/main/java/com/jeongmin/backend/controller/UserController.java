package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.DecorDetailResponse;
import com.jeongmin.backend.dto.FeedbackResponse;
import com.jeongmin.backend.dto.LoginResponse;
import com.jeongmin.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/login/check")
    public ResponseEntity<LoginResponse> checkLogin() {
        LoginResponse response = userService.checkLogin();
        return ResponseEntity.ok(response);

    }

    @GetMapping("/me/decors")
    public ResponseEntity<List<DecorDetailResponse>> getMyDecors() {
        List<DecorDetailResponse> response = userService.getMyDecors();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/feedbacks")
    public ResponseEntity<List<FeedbackResponse>> getMyFeedbacks() {
        List<FeedbackResponse> response = userService.getMyFeedback();
        return ResponseEntity.ok(response);
    }

}
