package com.jeongmin.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(
        name = "user",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "providerId"})
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider;

    @Column(nullable = false)
    private String providerId;

    @Column(length = 30)
    private String nickname;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Decor> decors = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Feedback> feedbacks = new ArrayList<>();

    public static User create(String provider, String providerId, String nickname) {
        User user = new User();
        user.provider = provider;
        user.providerId = providerId;
        user.nickname = nickname;
        return user;
    }

    public void addDecor(Decor decor) {
        decors.add(decor);
        decor.setUser(this);
    }

    public void addFeedback(Feedback feedback) {
        feedbacks.add(feedback);
        feedback.setUser(this);
    }

}
