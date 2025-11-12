import React from "react";
import { useTranslation } from "react-i18next";

export default function CommentList({ list = [] }) {
  const { t } = useTranslation();
  const sortedList = [...list].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <div className="comment-list">
      {sortedList.map((item, idx) => (
        <div key={idx} className="comment-item">
          <div className="comment-item-header">
            <div
              className="comment-item-emoji emoji"
              style={{ backgroundColor: item.bgColor }}
            >
              {item.emoji}
            </div>
            <div className="comment-item-nickname">{item.nickname}</div>
          </div>
          <div className="comment-item-text">{item.comment}</div>

          {item.answer && (
            <div className="comment-item-answer">{item.answer}</div>
          )}

          <div className="comment-item-meta">
            {t(`report.category.${item.category}`)} / {item.createdAt}
          </div>
        </div>
      ))}
    </div>
  );
}
