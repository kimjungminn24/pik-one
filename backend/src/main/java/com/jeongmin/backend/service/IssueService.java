package com.jeongmin.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jeongmin.backend.client.GithubIssueClient;
import com.jeongmin.backend.dto.IssueRequest;
import com.jeongmin.backend.dto.IssueResponse;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final GithubIssueClient client;
    private final ObjectMapper objectMapper;

    @Value("${github.owner}")
    private String owner;

    @Value("${github.repo}")
    private String repo;

    @Value("${github.issue.number}")
    private int issueNumber;

    public void addComment(IssueRequest request) {
        try {
            client.addComment(owner, repo, issueNumber, request);
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    public List<IssueResponse> getComments() {
        List<Map<String, Object>> comments = client.getComments(owner, repo, issueNumber);
        return comments.stream()
                .filter(this::isAuthorOwner)
                .map(comment -> (String) comment.get("body"))
                .filter(Objects::nonNull)
                .map(this::parseIssueFromBody)
                .flatMap(Optional::stream)
                .toList();
    }

    private Optional<IssueResponse> parseIssueFromBody(String body) {
        String json = extractJsonFromIssueBlock(body);
        if (json == null) return Optional.empty();

        try {
            Map<String, Object> parsed = objectMapper.readValue(json, Map.class);
            return Optional.of(IssueResponse.from(parsed));
        } catch (Exception e) {
            throw new RestApiException(ErrorCode.EXTERNAL_API_ERROR);
        }
    }

    private String extractJsonFromIssueBlock(String body) {
        Pattern pattern = Pattern.compile("<!-- ISSUE_START\\s*(\\{.*?\\})\\s*ISSUE_END -->", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(body);
        return matcher.find() ? matcher.group(1) : null;
    }

    private boolean isAuthorOwner(Map<String, Object> comment) {
        Map<String, Object> user = (Map<String, Object>) comment.get("user");
        if (user == null) return false;
        String login = (String) user.get("login");
        return owner.equals(login);
    }

}
