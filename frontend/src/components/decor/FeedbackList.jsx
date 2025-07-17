import "../../css/feedback.scss";

export default function FeedbackList({ feedbacks }) {
  if (feedbacks.length === 0) {
    return (
      <p className="feedback-list__empty">아직 등록된 피드백이 없습니다.</p>
    );
  }

  return (
    <>
      {feedbacks.map((item) => (
        <div key={item.id} className="feedback-list__item">
          <strong
            className={`feedback-list__label ${
              item.type === "HELPFUL"
                ? "feedback-list__label--helpful"
                : "feedback-list__label--not-found"
            }`}
          >
            {item.type === "HELPFUL" ? " 찾았어요" : "없어요"}
          </strong>
          <span className="feedback-list__content">{item.content}</span>
        </div>
      ))}
    </>
  );
}
