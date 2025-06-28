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

    private static double calculateDistance(
            double lat1, double lng1,
            double lat2, double lng2
    ) {
        double earthRadius = 6371000;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }

    @Transactional
    public void deleteDecor(Long decorId) {
        Decor decor = decorRepository.findById(decorId)
                .orElseThrow(() -> new IllegalArgumentException("해당 Decor를 찾을 수 없습니다."));


        User user = getCurrentUser();

        if (!decor.getUser().equals(user)) {
            throw new IllegalStateException("해당 Decor를 삭제할 권한이 없습니다.");
        }

        decorRepository.delete(decor);
    }

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

        User user = getCurrentUser();

        if (checkDecorExistsNearby(request.lat(), request.lng(), request.type())) {
            throw new IllegalStateException("이미 해당 위치에 같은 타입의 Decor가 존재합니다.");
        }

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

    public boolean checkDecorExistsNearby(Double lat, Double lng, DecorType type) {
        double latRange = 50.0 / 111000.0;
        double lngRange = 50.0 / 111000.0;

        List<Decor> nearby = decorRepository.findByBoundaryAndType(
                lat + latRange,
                lat - latRange,
                lng + lngRange,
                lng - lngRange,
                type
        );

        return nearby.stream()
                .anyMatch(d -> calculateDistance(
                        d.getLat(), d.getLng(),
                        lat, lng
                ) <= 50);
    }

    private User getCurrentUser() {
        String providerId = SecurityUtil.getCurrentProviderId();

        return userRepository.findByProviderAndProviderId("naver", providerId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
    }
}

