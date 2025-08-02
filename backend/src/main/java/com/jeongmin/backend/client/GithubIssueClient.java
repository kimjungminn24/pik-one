package com.jeongmin.backend.client;


import com.jeongmin.backend.config.GithubIssueFeignConfig;
import com.jeongmin.backend.dto.IssueRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@FeignClient(
        name = "githubIssueClient",
        url = "https://api.github.com",
        configuration = GithubIssueFeignConfig.class
)
public interface GithubIssueClient {

    @PostMapping("/repos/{owner}/{repo}/issues/{issue_number}/comments")
    void addComment(
            @PathVariable("owner") String owner,
            @PathVariable("repo") String repo,
            @PathVariable("issue_number") int issueNumber,
            @RequestBody IssueRequest request
    );

    @GetMapping("/repos/{owner}/{repo}/issues/{issue_number}/comments")
    List<Map<String, Object>> getComments(
            @PathVariable("owner") String owner,
            @PathVariable("repo") String repo,
            @PathVariable("issue_number") int issueNumber
    );
}