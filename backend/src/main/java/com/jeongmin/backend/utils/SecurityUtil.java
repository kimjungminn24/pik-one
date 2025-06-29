package com.jeongmin.backend.utils;

import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class SecurityUtil {

    public static String getCurrentProviderId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("현재 로그인 상태가 아닙니다.");
        }

        return authentication.getPrincipal().toString();
    }

    public static boolean isLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal());
    }
}
