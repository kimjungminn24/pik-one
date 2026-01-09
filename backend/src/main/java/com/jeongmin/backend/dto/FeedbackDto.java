package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.FeedbackType;

public record FeedbackDto(
        Long id,
        Long decorId,
        FeedbackType type,
        Boolean isAuthor,
        String content
) {

    public static FeedbackDto from(Feedback feedback, Long currentUserId) {
        boolean isAuthor = feedback.getUser().getId().equals(currentUserId);
        return new FeedbackDto(
                feedback.getId(),
                feedback.getDecor().getId(),
                feedback.getType(),
                isAuthor,
                feedback.getContent()
        );
    }

}
