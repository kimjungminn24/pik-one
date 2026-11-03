package com.jeongmin.backend.dto;

public record FeedbackCounts(int helpful, int notFound) {

    public static final FeedbackCounts EMPTY = new FeedbackCounts(0, 0);
}
