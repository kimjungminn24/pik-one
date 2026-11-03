package com.jeongmin.backend.service;

import com.jeongmin.backend.dto.FeedbackCounts;
import com.jeongmin.backend.dto.FeedbackCreateRequest;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.Feedback;
import com.jeongmin.backend.entity.FeedbackType;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;

    @Transactional(readOnly = true)
    public Map<Long, FeedbackCounts> countByDecorIds(Collection<Long> decorIds) {
        Map<Long, FeedbackCounts> result = new HashMap<>();
        if (decorIds.isEmpty()) {
            return result;
        }

        for (Object[] row : feedbackRepository.countByDecorIdsGroupByType(decorIds)) {
            Long decorId = (Long) row[0];
            FeedbackType type = (FeedbackType) row[1];
            int count = ((Long) row[2]).intValue();

            FeedbackCounts prev = result.getOrDefault(decorId, FeedbackCounts.EMPTY);
            result.put(decorId, type == FeedbackType.HELPFUL
                    ? new FeedbackCounts(count, prev.notFound())
                    : new FeedbackCounts(prev.helpful(), count));
        }
        return result;
    }

    @Transactional
    public Feedback create(FeedbackCreateRequest request, User user, Decor decor) {
        if (user != null && existsByUserAndDecor(user.getId(), decor.getId())) {
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

        if (!feedback.isWrittenBy(userId)) {
            throw new RestApiException(ErrorCode.NO_PERMISSION_FEEDBACK_DELETE);
        }

        feedbackRepository.delete(feedback);
    }
}
