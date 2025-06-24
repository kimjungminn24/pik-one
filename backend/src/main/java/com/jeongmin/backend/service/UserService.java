package com.jeongmin.backend.service;

import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    private void saveNewUser(String provider, String providerId) {
        String nickname = generateRandomNickname();
        User newUser = User.create(provider, providerId, nickname);
        userRepository.save(newUser);
    }


    private String generateRandomNickname() {
        return String.format("%s_%s", NICKNAME_PREFIX, UUID.randomUUID().toString().substring(0, 8));
    }
}
