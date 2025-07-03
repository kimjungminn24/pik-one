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
        int helpfulCount,
        int notFoundCount,
        List<FeedbackDto> feedbacks
) {
    public static DecorDetailResponse from(
            Decor decor,
            List<FeedbackDto> feedbacks,
            int helpfulCount,
            int notFoundCount
    ) {
        return new DecorDetailResponse(
                decor.getId(),
                decor.getLat(),
                decor.getLng(),
                decor.getType(),
                decor.getContent(),
                helpfulCount,
                notFoundCount,
                feedbacks
        );
    }
}
