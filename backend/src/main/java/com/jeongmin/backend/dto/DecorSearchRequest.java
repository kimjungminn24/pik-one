package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.DecorType;

public record DecorSearchRequest(
        double northLat,
        double southLat,
        double eastLng,
        double westLng,
        DecorType type
) {
}
