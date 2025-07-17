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
        className={`feedback-buttons__button feedback-buttons__button--helpful ${
          selectedType === "HELPFUL" ? "feedback-buttons__button--selected" : ""
        }`}
        onClick={() => onClick("HELPFUL")}
        disabled={isPending}
      >
        찾았어요 😊
        <span className="feedback-buttons__count-badge">
          {displayedHelpful}
        </span>
      </button>

      <button
        className={`feedback-buttons__button feedback-buttons__button--not-found ${
          selectedType === "NOT_FOUND"
            ? "feedback-buttons__button--selected"
            : ""
        }`}
        onClick={() => onClick("NOT_FOUND")}
        disabled={isPending}
      >
        없어요 😢
        <span className="feedback-buttons__count-badge">
          {displayedNotFound}
        </span>
      </button>
    </div>
  );
}
