package com.jeongmin.backend.controller;

import com.jeongmin.backend.dto.IssueRequest;
import com.jeongmin.backend.dto.IssueResponse;
import com.jeongmin.backend.service.IssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issue")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    public ResponseEntity<Void> addComment(@RequestBody IssueRequest request) {
        issueService.addComment(request);
        return ResponseEntity.ok().build();

    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> getComments() {
        List<IssueResponse> response = issueService.getComments();
        return ResponseEntity.ok(response);

    }

}
