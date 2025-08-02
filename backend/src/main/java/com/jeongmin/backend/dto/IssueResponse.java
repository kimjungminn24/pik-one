package com.jeongmin.backend.dto;

import java.util.Map;

public record IssueResponse(
        String emoji,
        String category,
        String bgColor,
        String nickname,
        String comment,
        String createdAt,
        String answer
) {
    public static IssueResponse from(Map<String, Object> map) {
        return new IssueResponse(
                (String) map.get("emoji"),
                (String) map.get("category"),
                (String) map.get("bgColor"),
                (String) map.get("nickname"),
                (String) map.get("comment"),
                (String) map.get("createdAt"),
                map.get("answer") == null ? null : map.get("answer").toString()
        );
    }
}
