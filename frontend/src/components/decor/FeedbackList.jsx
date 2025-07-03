export default function FeedbackList({ feedbacks }) {
  if (feedbacks.length === 0) {
    return <p className="no-feedback">아직 등록된 피드백이 없습니다.</p>;
  }

  return (
    <>
      {feedbacks.map((item) => (
        <div key={item.id} className="feedback-item">
          <strong
            className={`feedback-label ${
              item.type === "HELPFUL" ? "helpful-text" : "not-exist-text"
            }`}
          >
            {item.type === "HELPFUL" ? " 찾았어요" : "없어요"}
          </strong>
          <span className="feedback-content">{item.content}</span>
        </div>
      ))}
    </>
  );
}
