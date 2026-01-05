package com.jeongmin.backend.facade;

import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.service.DecorService;
import com.jeongmin.backend.service.LikeService;
import com.jeongmin.backend.service.UserService;
import com.jeongmin.backend.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class LikeFacade {

    private final LikeService likeService;
    private final DecorService decorService;
    private final UserService userService;


    @Transactional
    public void like(Long decorId) {
        User user = userService.getCurrentUser();
        Decor decor = decorService.getActiveDecorById(decorId);
        likeService.like(user, decor);
    }

    @Transactional
    public void unlike(Long decorId) {
        Long userId = SecurityUtil.getCurrentUserId();
        likeService.unlike(userId, decorId);
    }

}
