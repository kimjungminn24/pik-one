import React from "react";

export default function CommentForm({ text, onChange, onSubmit }) {
  return (
    <div className="report-comment-form">
      <textarea
        className="report-comment-textarea"
        placeholder="댓글을 입력하세요"
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="report-comment-submit-button" onClick={onSubmit}>
        댓글 남기기
      </div>
    </div>
  );
}
