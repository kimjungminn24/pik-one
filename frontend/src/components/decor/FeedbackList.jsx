import { useTranslation } from "react-i18next";
import "../../css/feedback.scss";
import { useDeleteFeedback } from "../../hooks/useDecor";

export default function FeedbackList({ feedbacks }) {
  const { t } = useTranslation();
  const { mutate } = useDeleteFeedback();

  if (feedbacks.length === 0) {
    return <p className="feedback-list__empty"> {t("feedback.no_feedback")}</p>;
  }

  const handleDelete = (feedback) => {
    mutate({ id: feedback.id, decorId: feedback.decorId });
  };

  return (
    <>
      {feedbacks.map((item) => (
        <div key={item.id} className="feedback-list__item">
          <div>
            <strong
              className={`feedback-list__label ${
                item.type === "HELPFUL"
                  ? "feedback-list__label--helpful emoji"
                  : "feedback-list__label--not-found emoji"
              }`}
            >
              {item.type === "HELPFUL"
                ? t("feedback.found")
                : t("feedback.not_found")}{" "}
            </strong>
            <span className="feedback-list__content">{item.content}</span>
          </div>
          {item.isAuthor && (
            <button
              className="feedback-list__delete"
              onClick={() => handleDelete(item)}
            >
              {t("popup.delete")}
            </button>
          )}
        </div>
      ))}
    </>
  );
}
