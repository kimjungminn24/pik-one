package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.LoginResponse;
import com.jeongmin.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        userService.logout(response);
        return ResponseEntity.noContent().build();
    }


}
