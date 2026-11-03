package com.jeongmin.backend.facade;

import com.jeongmin.backend.dto.*;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.service.DecorService;
import com.jeongmin.backend.service.FeedbackService;
import com.jeongmin.backend.service.LikeService;
import com.jeongmin.backend.service.UserService;
import com.jeongmin.backend.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DecorFacade {
    private final DecorService decorService;
    private final UserService userService;
    private final LikeService likeService;
    private final FeedbackService feedbackService;
    private final DecorCreateLockManager lockManager;
    private final DecorLockKeyGenerator lockKeyGenerator;

    @Transactional(readOnly = true)
    public List<DecorSearchResponse> searchDecorInBoundary(DecorSearchRequest request) {
        List<Decor> decors = decorService.searchDecorInBoundary(request);
        Map<Long, FeedbackCounts> counts = feedbackService.countByDecorIds(
                decors.stream().map(Decor::getId).toList()
        );

        return decors.stream()
                .map(decor -> DecorSearchResponse.of(
                        decor,
                        counts.getOrDefault(decor.getId(), FeedbackCounts.EMPTY)
                ))
                .toList();
    }

    // 지도는 처음에 전부 받아 브라우저에서 묶는다. 수만 개까지는 이 방식으로 충분
    @Transactional(readOnly = true)
    public List<DecorSearchResponse> getAllDecors() {
        Map<Long, FeedbackCounts> counts = feedbackService.countAll();
        return decorService.findAllActive().stream()
                .map(decor -> DecorSearchResponse.of(
                        decor,
                        counts.getOrDefault(decor.getId(), FeedbackCounts.EMPTY)
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public DecorDetailResponse getDecorById(Long decorId) {
        Decor decor = decorService.getActiveDecorById(decorId);
        Long userId = currentUserIdOrNull();
        int likeCount = likeService.countByDecorId(decorId);
        boolean likedByMe = (userId != null)
                && likeService.isLikedByUser(decorId, userId);

        List<FeedbackDto> feedbacks = decor.getFeedbacks().stream()
                .map(feedback -> FeedbackDto.from(feedback, userId))
                .toList();

        return DecorDetailResponse.from(
                decor,
                feedbacks,
                userId,
                likeCount,
                likedByMe
        );
    }

    @Transactional
    public void deleteDecor(Long decorId) {
        Decor decor = decorService.getActiveDecorById(decorId);
        User user = userService.getCurrentUser();
        if (!decor.isWrittenBy(user.getId())) {
            throw new RestApiException(ErrorCode.NO_PERMISSION_DECOR_DELETE);
        }
        decorService.delete(decor);
    }


    public DecorResponse createNewDecorWithoutLock(DecorCreateRequest request) {
        Long userId = currentUserIdOrNull();
        return decorService.createNewDecorTransactional(request, userId);
    }

    public DecorResponse createNewDecor(DecorCreateRequest request) {
        Long userId = currentUserIdOrNull();
        List<String> lockKeys = lockKeyGenerator.generate(request);
        return lockManager.executeWithLock(lockKeys, () -> decorService.createNewDecorTransactional(request, userId));
    }


    @Transactional(readOnly = true)
    public List<DecorDetailResponse> getMyDecors() {

        User user = userService.getCurrentUser();
        Long userId = user.getId();

        List<Decor> decors = decorService.findMyDecorsWithFeedbacks(userId);

        return decors.stream()
                .map(decor -> toDecorDetailResponse(decor, userId))
                .toList();
    }

    // 로그인하지 않았으면 null. 등록에서는 익명 스팟이 된다
    private Long currentUserIdOrNull() {
        return SecurityUtil.isLogin() ? SecurityUtil.getCurrentUserId() : null;
    }

    private DecorDetailResponse toDecorDetailResponse(Decor decor, Long userId) {

        List<FeedbackDto> feedbacks = decor.getFeedbacks().stream()
                .map(feedback -> FeedbackDto.from(feedback, userId))
                .toList();

        int likeCount = likeService.countByDecorId(decor.getId());
        boolean likedByMe = likeService.isLikedByUser(decor.getId(), userId);

        return DecorDetailResponse.from(
                decor,
                feedbacks,
                userId,
                likeCount,
                likedByMe
        );
    }
}
