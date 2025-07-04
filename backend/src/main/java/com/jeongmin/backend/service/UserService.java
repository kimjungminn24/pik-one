package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.DecorDetailResponse;
import com.jeongmin.backend.dto.LoginResponse;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.repository.UserRepository;
import com.jeongmin.backend.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final String NICKNAME_PREFIX = "pikmin";
    private final UserRepository userRepository;

    public void registerIfNotExists(String provider, String providerId) {
        if (!userRepository.existsByProviderAndProviderId(provider, providerId)) {
            saveNewUser(provider, providerId);
        }
    }

    public List<DecorDetailResponse> getMyDecors() {
        if (!SecurityUtil.isLogin()) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        User user = getCurrentUser();
        return user.getDecors().stream()
                .map(decor -> DecorDetailResponse.from(
                        decor,
                        decor.getFeedbacks().stream()
                                .map(FeedbackDto::from)
                                .toList()
                ))
                .toList();
    }


    private void saveNewUser(String provider, String providerId) {
        String nickname = generateRandomNickname();
        User newUser = User.create(provider, providerId, nickname);
        userRepository.save(newUser);
    }

    public LoginResponse checkLogin() {
        return new LoginResponse(SecurityUtil.isLogin());
    }

    private String generateRandomNickname() {
        return String.format("%s_%s", NICKNAME_PREFIX, UUID.randomUUID().toString().substring(0, 8));
    }

    private User getCurrentUser() {
        String providerId = SecurityUtil.getCurrentProviderId();

        return userRepository.findByProviderAndProviderId("naver", providerId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
    }
}
