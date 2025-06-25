package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.DecorResponse;
import com.jeongmin.backend.dto.DecorSearchRequest;
import com.jeongmin.backend.repository.DecorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DecorService {


    private final DecorRepository decorRepository;

    public List<DecorResponse> searchDecorInBoundary(DecorSearchRequest request) {
        return decorRepository.findByBoundaryAndType(
                        request.northLat(),
                        request.southLat(),
                        request.eastLng(),
                        request.westLng(),
                        request.type()
                )
                .stream()
                .map(DecorResponse::from)
                .toList();
    }

}

