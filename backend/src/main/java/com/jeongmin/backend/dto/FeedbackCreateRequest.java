package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.FeedbackType;

public record FeedbackCreateRequest(
        Long userId,
        Long decorId,
        FeedbackType feedbackType,
        String content
) {
}

