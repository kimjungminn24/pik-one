package com.jeongmin.backend.dto;

import com.jeongmin.backend.entity.DecorType;

import java.util.List;

public record LocationCheckResponse(
        Boolean isRegisterable,
        List<DecorType> existingDecors

) {


}
