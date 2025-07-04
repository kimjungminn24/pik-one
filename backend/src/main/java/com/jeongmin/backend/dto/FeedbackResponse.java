package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.FeedbackType;

public record FeedbackResponse(
        Long id,
        Long decorId,
        FeedbackType type,
        String content
) {

    public static FeedbackResponse from(Feedback feedback) {
        return new FeedbackResponse(
                feedback.getId(),
                feedback.getDecor().getId(),
                feedback.getType(),
                feedback.getContent()
        );
    }
}
