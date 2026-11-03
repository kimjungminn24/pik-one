import React from "react";
import { useTranslation } from "react-i18next";

export default function CommentForm({ text, onChange, onSubmit }) {
  const { t } = useTranslation();
  return (
    <div className="report-comment-form">
      <textarea
        className="field"
        placeholder={t("report.form.placeholder")}
        value={text}
        maxLength={1000}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="btn btn--primary report-comment-form__submit"
        onClick={onSubmit}
        disabled={!text.trim()}
      >
        {t("report.form.button")}
      </button>
    </div>
  );
}
