import { useTranslation } from "react-i18next";

export default function FeedbackButtons({
  selectedType,
  isPending,
  displayedHelpful,
  displayedNotFound,
  onClick,
}) {
  const { t } = useTranslation();

  return (
    <div className="feedback-buttons">
      <button
        className={`feedback-buttons__button emoji feedback-buttons__button--helpful ${
          selectedType === "HELPFUL" ? "feedback-buttons__button--selected" : ""
        }`}
        onClick={() => onClick("HELPFUL")}
        disabled={isPending}
      >
        {t("feedback.found")}
        <span className="feedback-buttons__count-badge">
          {displayedHelpful}
        </span>
      </button>

      <button
        className={`emoji feedback-buttons__button feedback-buttons__button--not-found ${
          selectedType === "NOT_FOUND"
            ? "feedback-buttons__button--selected"
            : ""
        }`}
        onClick={() => onClick("NOT_FOUND")}
        disabled={isPending}
      >
        {t("feedback.not_found")}
        <span className="feedback-buttons__count-badge">
          {displayedNotFound}
        </span>
      </button>
    </div>
  );
}
