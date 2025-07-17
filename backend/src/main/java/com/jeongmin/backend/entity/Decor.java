package com.jeongmin.backend.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLDelete(sql = "UPDATE decor SET deleted_at = now() WHERE id = ?")
@Table(name = "decor", indexes = {
        @Index(name = "idx_lat_lng", columnList = "lat, lng")
})
public class Decor extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DecorType type;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column(length = 500)
    private String content;

    @Column(nullable = false)
    private boolean deleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "decor", cascade = CascadeType.ALL)
    private List<Feedback> feedbacks = new ArrayList<>();

    public static Decor createNewDecor(Double lat, Double lng, DecorType type, String content, User user) {
        Decor decor = new Decor();
        decor.lat = lat;
        decor.lng = lng;
        decor.type = type;
        decor.content = content;
        user.addDecor(decor);
        return decor;
    }

    public void addFeedback(Feedback feedback) {
        feedbacks.add(feedback);
        feedback.setDecor(this);
    }

    public void setUser(User user) {
        this.user = user;
    }

}
