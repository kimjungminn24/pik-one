package com.jeongmin.backend.facade;

import com.jeongmin.backend.dto.DecorCreateRequest;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DecorLockKeyGenerator {

    private static final double CELL_SIZE = 0.00022; 

    public List<String> generate(DecorCreateRequest request) {
        int latCell = (int) (request.lat() / CELL_SIZE);
        int lngCell = (int) (request.lng() / CELL_SIZE);

        List<String> keys = new ArrayList<>();
        for (int dLat = -1; dLat <= 1; dLat++) {
            for (int dLng = -1; dLng <= 1; dLng++) {
                keys.add(request.type() + ":" + (latCell + dLat) + ":" + (lngCell + dLng));
            }
        }
        return keys;
    }
}