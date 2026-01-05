package com.jeongmin.backend.service;


import com.jeongmin.backend.entity.Decor;
import com.jeongmin.backend.entity.Like;
import com.jeongmin.backend.entity.User;
import com.jeongmin.backend.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;

    public void like(User user, Decor decor) {
        likeRepository.save(Like.createLike(user, decor));
    }

    public void unlike(Long userId, Long decorId) {
        likeRepository.deleteByUserIdAndDecorId(userId, decorId);
    }

    public int countByDecorId(Long decorId) {
        return likeRepository.countByDecorId(decorId);
    }

    public boolean isLikedByUser(Long userId, Long decorId) {
        return likeRepository.existsByUserIdAndDecorId(userId, decorId);
    }


}
