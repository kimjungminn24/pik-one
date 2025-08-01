import React from "react";

export default function CommentList({ list = [] }) {
  return (
    <div className="comment-list">
      {list.map((item, idx) => (
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
          <div className="comment-item-meta">
            {item.category} / {item.createdAt}
          </div>
        </div>
      ))}
    </div>
  );
}
