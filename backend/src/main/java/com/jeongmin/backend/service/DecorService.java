package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.*;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.DecorType;
import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.repository.DecorRepository;
import com.jeongmin.backend.repository.FeedbackRepository;
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
    private final FeedbackRepository feedbackRepository;
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

    public DecorDetailResponse getDecorById(Long decorId) {
        Decor decor = getActiveDecorById(decorId);
        List<FeedbackDto> feedbacks = decor.getFeedbacks().stream()
                .map(FeedbackDto::from)
                .toList();


        return DecorDetailResponse.from(decor, feedbacks);
    }

    @Transactional
    public void deleteDecor(Long decorId) {
        Decor decor = getActiveDecorById(decorId);

        long userId = SecurityUtil.getCurrentUserId();
        if (!decor.getUser().getId().equals(userId)) {
            throw new RestApiException(ErrorCode.NO_PERMISSION_DECOR_DELETE);
        }

        decorRepository.delete(decor);
    }

    public List<DecorResponse> searchDecorInBoundary(DecorSearchRequest request) {
        List<Decor> decors = (request.type() == null)
                ? decorRepository.findByBoundary(request.northLat(), request.southLat(), request.eastLng(),
                request.westLng()) : decorRepository.findByBoundaryAndType(
                        request.northLat(),
                        request.southLat(),
                        request.eastLng(),
                        request.westLng(),
                        request.type()
        );

        return decors.stream()
                .map(DecorResponse::from)
                .toList();
    }

    @Transactional
    public DecorResponse createNewDecor(DecorCreateRequest request) {

        long userId = SecurityUtil.getCurrentUserId();

        if (checkDecorExistsNearby(request.lat(), request.lng(), request.type())) {
            throw new RestApiException(ErrorCode.DUPLICATE_DECOR);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_FOUND));

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

    @Transactional
    public FeedbackDto createNewFeedback(FeedbackCreateRequest request) {
        Decor decor = getActiveDecorById(request.decorId());
        long userId = SecurityUtil.getCurrentUserId();

        if (feedbackRepository.existsByUserIdAndDecorId(userId, decor.getId())) {
            throw new RestApiException(ErrorCode.DUPLICATE_FEEDBACK);
        }

        User user = userRepository.getReferenceById(userId);
        Feedback feedback = Feedback.create(
                request.feedbackType(),
                request.content(),
                user,
                decor
        );

        feedbackRepository.save(feedback);
        return FeedbackDto.from(feedback);
    }


    public List<DecorDetailResponse> getMyDecors() {

        long userId = SecurityUtil.getCurrentUserId();
        List<Decor> decors = decorRepository.findWithFeedbacksByUserId(userId);
        return decors.stream()
                .map(decor -> DecorDetailResponse.from(
                        decor,
                        decor.getFeedbacks().stream()
                                .map(FeedbackDto::from)
                                .toList()
                ))
                .toList();
    }

    public List<FeedbackResponse> getMyFeedback() {

        Long userId = SecurityUtil.getCurrentUserId();

        List<Feedback> feedbackList = feedbackRepository.findByUserId(userId);

        return feedbackList.stream()
                .map(FeedbackResponse::from)
                .toList();
    }


    private Decor getActiveDecorById(Long decorId) {
        return decorRepository.findByIdAndDeletedAtIsNull(decorId)
                .orElseThrow(() -> new RestApiException(ErrorCode.DECOR_NOT_FOUND));
    }


}

