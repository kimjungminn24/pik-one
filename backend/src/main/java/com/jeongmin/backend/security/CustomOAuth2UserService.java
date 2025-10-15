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
        String provider = userRequest.getClientRegistration().getRegistrationId();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        Map<String, Object> userAttributes = extractUserAttributes(provider, attributes);
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                userAttributes,
                "id"
        );
    }

    private Map<String, Object> extractUserAttributes(String provider, Map<String, Object> attributes) {
        String providerId;

        switch (provider) {
            case "kakao" -> providerId = String.valueOf(attributes.get("id"));
            case "naver" -> providerId = (String) ((Map<String, Object>) attributes.get("response")).get("id");
            case "line" -> providerId = (String) attributes.get("userId");
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }

        Long userId = userService.registerIfNotExists(provider, providerId);

        return Map.of(
                "provider", provider,
                "id", providerId,
                "userId", userId
        );
    }
}
