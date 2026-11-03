package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Decor;

public record DecorSearchResponse(
        Long id,
        double lat,
        double lng,
        String type,
        String content,
        int helpfulCount,
        int notFoundCount
) {

    public static DecorSearchResponse of(Decor decor, FeedbackCounts counts) {
        return new DecorSearchResponse(
                decor.getId(),
                decor.getLat(),
                decor.getLng(),
                decor.getType().name(),
                decor.getContent(),
                counts.helpful(),
                counts.notFound()
        );
    }
}
