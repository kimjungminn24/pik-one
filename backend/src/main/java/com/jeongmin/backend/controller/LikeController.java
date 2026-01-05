package com.jeongmin.backend.controller;


import com.jeongmin.backend.facade.LikeFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeFacade likeFacade;

    @PostMapping("/{id}")
    public ResponseEntity<Void> like(
            @PathVariable Long id
    ) {
        likeFacade.like(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> unlike(
            @PathVariable Long id
    ) {
        likeFacade.unlike(id);
        return ResponseEntity.noContent().build();
    }


}
