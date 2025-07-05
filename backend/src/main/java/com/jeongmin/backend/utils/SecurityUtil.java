package com.jeongmin.backend.utils;

import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class SecurityUtil {

    public static String getCurrentProviderId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RestApiException(ErrorCode.LOGIN_REQUIRED);
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
