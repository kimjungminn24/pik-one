package com.jeongmin.backend.facade;


import com.jeongmin.backend.dto.FeedbackCreateRequest;
import com.jeongmin.backend.dto.FeedbackDto;
import com.jeongmin.backend.dto.FeedbackResponse;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.service.DecorService;
import com.jeongmin.backend.service.FeedbackService;
import com.jeongmin.backend.service.UserService;
import com.jeongmin.backend.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FeedbackFacade {

    private final FeedbackService feedbackService;
    private final DecorService decorService;
    private final UserService userService;

    @Transactional
    public FeedbackDto createFeedback(FeedbackCreateRequest request) {
        long userId = SecurityUtil.getCurrentUserId();
        User user = userService.getRef(userId);
        Decor decor = decorService.getActiveDecorById(request.decorId());

        return FeedbackDto.from(
                feedbackService.create(request, user, decor), userId
        );
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getMyFeedbacks() {
        long userId = SecurityUtil.getCurrentUserId();

        return feedbackService.findByUser(userId)
                .stream()
                .map(FeedbackResponse::from)
                .toList();
    }

    @Transactional
    public void deleteMyFeedback(Long feedbackId) {
        long userId = SecurityUtil.getCurrentUserId();
        feedbackService.deleteByIdAndUser(feedbackId, userId);
    }
}
