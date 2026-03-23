package com.jeongmin.backend.facade;

import com.jeongmin.backend.dto.*;
import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.exception.ErrorCode;
import com.jeongmin.backend.exception.RestApiException;
import com.jeongmin.backend.service.DecorService;
import com.jeongmin.backend.service.LikeService;
import com.jeongmin.backend.service.UserService;
import com.jeongmin.backend.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DecorFacade {
    private final DecorService decorService;
    private final UserService userService;
    private final LikeService likeService;
    private final DecorCreateLockManager lockManager;
    private final DecorLockKeyGenerator lockKeyGenerator;

    @Transactional(readOnly = true)
    public List<DecorResponse> searchDecorInBoundary(DecorSearchRequest request) {
        return decorService.searchDecorInBoundary(request).stream()
                .map(DecorResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DecorDetailResponse getDecorById(Long decorId) {
        Decor decor = decorService.getActiveDecorById(decorId);
        Long userId = SecurityUtil.isLogin()
                ? SecurityUtil.getCurrentUserId()
                : null;
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
        if (!decor.getUser().getId().equals(user.getId())) {
            throw new RestApiException(ErrorCode.NO_PERMISSION_DECOR_DELETE);
        }
        decorService.delete(decor);
    }


    public DecorResponse createNewDecorWithoutLock(DecorCreateRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        return decorService.createNewDecorTransactional(request, userId);
    }

    public DecorResponse createNewDecor(DecorCreateRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
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
