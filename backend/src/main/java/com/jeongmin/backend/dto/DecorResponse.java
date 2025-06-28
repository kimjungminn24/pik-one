package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.Decor;

public record DecorResponse(
        Long id,
        double lat,
        double lng,
        String type
) {

    public static DecorResponse from(Decor decor) {
        return new DecorResponse(
                decor.getId(),
                decor.getLat(),
                decor.getLng(),
                decor.getType().name()
        );
    }

}
