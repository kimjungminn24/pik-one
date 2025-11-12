import React from "react";
import { useTranslation } from "react-i18next";

export default function CommentForm({ text, onChange, onSubmit }) {
  const { t } = useTranslation();
  return (
    <div className="report-comment-form">
      <textarea
        className="report-comment-textarea"
        placeholder={t("report.form.placeholder")}
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="report-comment-submit-button" onClick={onSubmit}>
        {t("report.form.button")}
      </div>
    </div>
  );
}
