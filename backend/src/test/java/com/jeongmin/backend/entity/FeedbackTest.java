package com.jeongmin.backend.entity;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class FeedbackTest {

    private final Decor decor = Decor.createNewDecor(37.5, 127.0, DecorType.CAFE, "", null);

    @Test
    void 로그인하지_않고_남기면_익명_피드백이다() {
        Feedback feedback = Feedback.create(FeedbackType.HELPFUL, "", null, decor);

        assertThat(feedback.isAnonymous()).isTrue();
        assertThat(feedback.isWrittenBy(1L)).isFalse();
        assertThat(decor.getFeedbacks()).containsExactly(feedback);
    }

    @Test
    void 로그인하고_남기면_작성자가_남는다() {
        User user = User.create("kakao", "123", "피크민");
        ReflectionTestUtils.setField(user, "id", 1L);

        Feedback feedback = Feedback.create(FeedbackType.NOT_FOUND, "", user, decor);

        assertThat(feedback.isAnonymous()).isFalse();
        assertThat(feedback.isWrittenBy(1L)).isTrue();
        assertThat(feedback.isWrittenBy(2L)).isFalse();
    }
}
