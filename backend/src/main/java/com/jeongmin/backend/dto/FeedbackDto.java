package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.FeedbackType;

public record FeedbackDto(
        Long id,
        FeedbackType type,
        String content
) {

    public static FeedbackDto from(Feedback feedback) {
        return new FeedbackDto(
                feedback.getId(),
                feedback.getType(),
                feedback.getContent()
        );
    }

}
