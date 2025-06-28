package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.DecorType;

public record LocationCheckRequest(
        double lat,
        double lng,
        DecorType type
) {
}
