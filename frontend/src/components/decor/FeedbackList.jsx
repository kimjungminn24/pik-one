import { useTranslation } from "react-i18next";
import "../../css/feedback.scss";

export default function FeedbackList({ feedbacks }) {
  const { t } = useTranslation();

  if (feedbacks.length === 0) {
    return <p className="feedback-list__empty"> {t("feedback.no_feedback")}</p>;
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
            {item.type === "HELPFUL"
              ? t("feedback.found")
              : t("feedback.not_found")}{" "}
          </strong>
          <span className="feedback-list__content">{item.content}</span>
        </div>
      ))}
    </>
  );
}
