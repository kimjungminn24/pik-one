package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.DecorCreateRequest;
import com.jeongmin.backend.dto.DecorSearchRequest;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.DecorType;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.repository.DecorRepository;
import com.jeongmin.backend.repository.LikeRepository;
import com.jeongmin.backend.repository.UserRepository;
import com.jeongmin.backend.utils.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DecorService {


    private final DecorRepository decorRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    public void delete(Decor decor) {
        decorRepository.delete(decor);
    }

    public List<Decor> searchDecorInBoundary(DecorSearchRequest request) {
        return (request.type() == null)
                ? decorRepository.findByBoundary(request.northLat(), request.southLat(), request.eastLng(),
                request.westLng()) : decorRepository.findByBoundaryAndType(
                request.northLat(),
                request.southLat(),
                request.eastLng(),
                request.westLng(),
                request.type()
        );

    }

    public Decor createDecor(DecorCreateRequest request, User user) {
        Decor decor = Decor.createNewDecor(
                request.lat(),
                request.lng(),
                request.type(),
                request.content(),
                user
        );
        return decorRepository.save(decor);
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
                .anyMatch(d -> GeoUtils.calculateDistance(
                        d.getLat(), d.getLng(),
                        lat, lng
                ) <= 50);
    }

    public List<Decor> findMyDecorsWithFeedbacks(Long userId) {
        return decorRepository.findWithFeedbacksByUserId(userId);
    }

    public Decor getActiveDecorById(Long decorId) {
        return decorRepository.findByIdAndDeletedAtIsNull(decorId)
                .orElseThrow(() -> new RestApiException(ErrorCode.DECOR_NOT_FOUND));
    }


}

