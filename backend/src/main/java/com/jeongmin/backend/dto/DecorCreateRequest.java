package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.DecorType;

public record DecorCreateRequest(
        double lat,
        double lng,
        DecorType type,
        String content
) {
}
