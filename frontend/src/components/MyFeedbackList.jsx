import { useTranslation } from "react-i18next";

export default function MyFeedbackList({ feedbacks, onSelect }) {
  const { t } = useTranslation();

  return (
    <ul className="my-feedback-list">
      {feedbacks.map((item) => {
        const key = item.type === "HELPFUL" ? "found" : "not_found";
        return (
          <li key={item.id}>
            <button
              type="button"
              className={`my-feedback spot-detail__review is-${key}`}
              onClick={() => onSelect(item.decorId)}
            >
              <span className="spot-detail__review-emoji emoji" aria-hidden="true">
                {item.type === "HELPFUL" ? "😊" : "😢"}
              </span>
              <span className="spot-detail__review-body">
                <strong className="spot-detail__review-result">{t(`spot.${key}`)}</strong>
                {item.content && (
                  <span className="spot-detail__review-text">{item.content}</span>
                )}
              </span>
              <span className="my-feedback__chevron" aria-hidden="true">
                ›
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
