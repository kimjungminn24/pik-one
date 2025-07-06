package com.jeongmin.backend.security;

import com.jeongmin.backend.jwt.JwtProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private static final String ACCESS_TOKEN_COOKIE_NAME = "access_token";
    private final JwtProvider jwtProvider;

    @Value("${app.front-url}")
    private String frontUrl;


    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> responseMap = oAuth2User.getAttributes();

        String providerId = (String) responseMap.get("id");

        String token = jwtProvider.createAccessToken(providerId);

        ResponseCookie cookie = createAccessTokenCookie(token);
        response.addHeader("Set-Cookie", cookie.toString());
        response.sendRedirect(frontUrl);
    }

    private ResponseCookie createAccessTokenCookie(String token) {
        return ResponseCookie.from(ACCESS_TOKEN_COOKIE_NAME, URLEncoder.encode(token, StandardCharsets.UTF_8))
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(jwtProvider.getAccessTokenExpirySeconds())
                .build();
    }
}
