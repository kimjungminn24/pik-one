package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.DecorType;
import com.jeongmin.backend.entity.FeedbackType;

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
            List<FeedbackDto> feedbacks
    ) {

        int notFoundCount = (int) feedbacks.stream()
                .filter(f -> f.type() == FeedbackType.NOT_FOUND)
                .count();

        int helpfulCount = (int) feedbacks.stream()
                .filter(f -> f.type() == FeedbackType.HELPFUL)
                .count();

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
