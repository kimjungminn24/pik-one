import { useTranslation } from "react-i18next";

export default function FeedbackForm({
  feedback,
  onChange,
  onSubmit,
  isPending,
  selectedType,
}) {
  const { t } = useTranslation();

  return (
    <>
      <textarea
        className="feedback-form__textarea"
        placeholder={t("feedback.placeholder")}
        value={feedback}
        onChange={onChange}
        disabled={isPending}
      />

      <button
        className="feedback-form__submit-button"
        onClick={onSubmit}
        disabled={isPending || !selectedType || feedback.trim() === ""}
      >
        {isPending ? t("feedback.submit_loading") : t("feedback.submit")}
      </button>
    </>
  );
}
