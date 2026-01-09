package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.FeedbackCreateRequest;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    @Transactional
    public Feedback create(FeedbackCreateRequest request, User user, Decor decor) {
        if (existsByUserAndDecor(user.getId(), decor.getId())) {
            throw new RestApiException(ErrorCode.DUPLICATE_FEEDBACK);
        }
        Feedback feedback = Feedback.create(
                request.feedbackType(),
                request.content(),
                user,
                decor
        );
        return feedbackRepository.save(feedback);
    }

    @Transactional(readOnly = true)
    public boolean existsByUserAndDecor(Long userId, Long decorId) {
        return feedbackRepository.existsByUserIdAndDecorId(userId, decorId);
    }

    @Transactional(readOnly = true)
    public List<Feedback> findByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }


    public void deleteByIdAndUser(Long feedbackId, Long userId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() ->
                        new RestApiException(ErrorCode.FEEDBACK_NOT_FOUND)
                );

        if (!feedback.getUser().getId().equals(userId)) {
            throw new RestApiException(ErrorCode.NO_PERMISSION_FEEDBACK_DELETE);
        }

        feedbackRepository.delete(feedback);
    }
}
