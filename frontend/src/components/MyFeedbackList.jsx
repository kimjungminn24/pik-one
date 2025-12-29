import { useTranslation } from "react-i18next";
import "../css/feedback.scss";
import { useDecorDetail } from "../hooks/useDecor";
import { useEffect, useState } from "react";

export default function MyFeedbackList({ feedbacks, onSelectDecor }) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const { data: decorDetail } = useDecorDetail(selectedId, !!selectedId);

  useEffect(() => {
    if (decorDetail) {
      onSelectDecor(decorDetail);
    }
  }, [decorDetail, onSelectDecor]);

  const clickFeedback = (id) => {
    setSelectedId(id);
  };

  return (
    <>
      {feedbacks.map((item) => (
        <div
          key={item.id}
          className="feedback-list__item"
          onClick={() => clickFeedback(item.decorId)}
        >
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
      ))}
    </>
  );
}
