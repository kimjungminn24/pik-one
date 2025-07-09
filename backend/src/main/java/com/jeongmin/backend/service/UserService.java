package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.LoginResponse;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.repository.UserRepository;
import com.jeongmin.backend.utils.SecurityUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String NICKNAME_PREFIX = "pikmin";
    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    private final UserRepository userRepository;

    public void registerIfNotExists(String provider, String providerId) {
        if (!userRepository.existsByProviderAndProviderId(provider, providerId)) {
            saveNewUser(provider, providerId);
        }
    }


    private void saveNewUser(String provider, String providerId) {
        String nickname = generateRandomNickname();
        User newUser = User.create(provider, providerId, nickname);
        userRepository.save(newUser);
    }

    public LoginResponse checkLogin() {
        boolean check = SecurityUtil.isLogin();
        if (!check) {
            throw new RestApiException(ErrorCode.LOGIN_REQUIRED);
        }
        return new LoginResponse(true);
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
    }

    private String generateRandomNickname() {
        return String.format("%s_%s", NICKNAME_PREFIX, UUID.randomUUID().toString().substring(0, 8));
    }


}
