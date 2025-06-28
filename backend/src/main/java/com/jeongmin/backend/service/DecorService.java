package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.DecorCreateRequest;
import com.jeongmin.backend.dto.DecorResponse;
import com.jeongmin.backend.dto.DecorSearchRequest;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.DecorType;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.repository.DecorRepository;
import com.jeongmin.backend.repository.UserRepository;
import com.jeongmin.backend.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DecorService {


    private final DecorRepository decorRepository;
    private final UserRepository userRepository;

    public List<DecorResponse> searchDecorInBoundary(DecorSearchRequest request) {
        return decorRepository.findByBoundaryAndType(
                        request.northLat(),
                        request.southLat(),
                        request.eastLng(),
                        request.westLng(),
                        request.type()
                )
                .stream()
                .map(DecorResponse::from)
                .toList();
    }

    @Transactional
    public DecorResponse createNewDecor(DecorCreateRequest request) {

        String providerId = SecurityUtil.getCurrentProviderId();

        User user = userRepository.findByProviderAndProviderId("naver", providerId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        Decor decor = Decor.createNewDecor(
                request.lat(),
                request.lng(),
                request.type(),
                request.content(),
                user
        );

        Decor saved = decorRepository.save(decor);

        return DecorResponse.from(saved);

    }

}

