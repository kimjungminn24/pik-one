package com.jeongmin.backend.security;

import com.jeongmin.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String provider = userRequest.getClientRegistration().getRegistrationId(); // naver, kakao 등

        Map<String, Object> userAttributes = Map.of();

        if ("kakao".equals(provider)) {
            String providerId = String.valueOf(attributes.get("id"));
            Long userId = userService.registerIfNotExists(provider, providerId);
            userAttributes = Map.of(
                    "provider", "kakao",
                    "id", providerId,
                    "userId", userId
            );
        } else if ("naver".equals(provider)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            String providerId = (String) response.get("id");
            Long userId = userService.registerIfNotExists(provider, providerId);
            userAttributes = Map.of(
                    "provider", "naver",
                    "id", providerId,
                    "userId", userId
            );
        }


        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                userAttributes,
                "id"
        );
    }
}
