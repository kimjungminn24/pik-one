package com.jeongmin.backend.controller;


import com.jeongmin.backend.dto.DecorCreateRequest;
import com.jeongmin.backend.dto.DecorDetailResponse;
import com.jeongmin.backend.dto.DecorResponse;
import com.jeongmin.backend.dto.DecorSearchRequest;
import com.jeongmin.backend.facade.DecorFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/decors")
@RequiredArgsConstructor
public class DecorController {
    private final DecorFacade decorFacade;

    @GetMapping("/search")
    public ResponseEntity<List<DecorResponse>> getDecorList(@ModelAttribute DecorSearchRequest request) {
        List<DecorResponse> response = decorFacade.searchDecorInBoundary(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<DecorResponse> postDecor(@RequestBody DecorCreateRequest request) {
        DecorResponse response = decorFacade.createNewDecor(request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDecor(@PathVariable("id") Long decorId) {
        decorFacade.deleteDecor(decorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DecorDetailResponse> getDecor(@PathVariable("id") Long decorId) {
        DecorDetailResponse response = decorFacade.getDecorById(decorId);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/me")
    public ResponseEntity<List<DecorDetailResponse>> getMyDecors() {
        List<DecorDetailResponse> response = decorFacade.getMyDecors();
        return ResponseEntity.ok(response);
    }


}
