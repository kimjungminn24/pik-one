package com.jeongmin.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Feedback extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeedbackType type;

    @Column(length = 500)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decor_id", nullable = false)
    private Decor decor;

    public static Feedback create(FeedbackType type, String content, User user, Decor decor) {
        Feedback feedback = new Feedback();
        feedback.type = type;
        feedback.content = content;
        feedback.user = user;
        feedback.decor = decor;
        return feedback;
    }
}
