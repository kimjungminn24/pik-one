export default function FeedbackButtons({
  selectedType,
  isPending,
  displayedHelpful,
  displayedNotFound,
  onClick,
}) {
  return (
    <div className="feedback-buttons">
      <button
        className={`feedback-button helpful ${
          selectedType === "HELPFUL" ? "selected" : ""
        }`}
        onClick={() => onClick("HELPFUL")}
        disabled={isPending}
      >
        찾았어요 😊
        <span className="count-badge">{displayedHelpful}</span>
      </button>

      <button
        className={`feedback-button not-exist ${
          selectedType === "NOT_FOUND" ? "selected" : ""
        }`}
        onClick={() => onClick("NOT_FOUND")}
        disabled={isPending}
      >
        없어요 😢
        <span className="count-badge">{displayedNotFound}</span>
      </button>
    </div>
  );
}
