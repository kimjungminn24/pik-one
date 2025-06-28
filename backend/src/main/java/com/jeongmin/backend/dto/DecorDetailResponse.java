package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.DecorType;

import java.util.List;

public record DecorDetailResponse(
        Long id,
        double lat,
        double lng,
        DecorType type,
        String content,
        List<FeedbackDto> feedbacks
) {
    public static DecorDetailResponse from(Decor decor, List<FeedbackDto> feedbacks) {
        return new DecorDetailResponse(
                decor.getId(),
                decor.getLat(),
                decor.getLng(),
                decor.getType(),
                decor.getContent(),
                feedbacks
        );
    }
}
