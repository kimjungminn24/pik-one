import { useTranslation } from "react-i18next";

export default function CommentList({ list = [] }) {
  const { t } = useTranslation();
  const sortedList = [...list].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (sortedList.length === 0) {
    return <p className="empty">{t("report.empty")}</p>;
  }

  return (
    <ul className="comment-list">
      {sortedList.map((item, idx) => (
        <li key={idx} className="comment-item">
          <span
            className="report-avatar emoji"
            style={{ backgroundColor: item.bgColor }}
            aria-hidden="true"
          >
            {item.emoji}
          </span>
          <div className="comment-item__body">
            <div className="comment-item__head">
              <strong className="comment-item__nickname">{item.nickname}</strong>
              <span className="comment-item__meta">
                {t(`report.category.${item.category}`)} · {item.createdAt}
              </span>
            </div>
            <p className="comment-item__text">{item.comment}</p>

            {item.answer && (
              <div className="comment-item__answer">
                <strong>{t("report.answer")}</strong>
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
