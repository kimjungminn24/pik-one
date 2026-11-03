package com.jeongmin.backend.entity;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class DecorTest {

    @Test
    void 로그인하지_않고_등록하면_익명_스팟이다() {
        Decor decor = Decor.createNewDecor(37.5, 127.0, DecorType.CAFE, "", null);

        assertThat(decor.isAnonymous()).isTrue();
        assertThat(decor.isWrittenBy(1L)).isFalse();
        assertThat(decor.isWrittenBy(null)).isFalse();
    }

    @Test
    void 로그인하고_등록하면_작성자가_남는다() {
        User user = User.create("kakao", "123", "피크민");
        ReflectionTestUtils.setField(user, "id", 1L);

        Decor decor = Decor.createNewDecor(37.5, 127.0, DecorType.CAFE, "", user);

        assertThat(decor.isAnonymous()).isFalse();
        assertThat(decor.isWrittenBy(1L)).isTrue();
        assertThat(decor.isWrittenBy(2L)).isFalse();
        assertThat(user.getDecors()).containsExactly(decor);
    }
}
