export default function FeedbackForm({
  feedback,
  onChange,
  onSubmit,
  isPending,
  selectedType,
}) {
  return (
    <>
      <textarea
        className="feedback-form__textarea"
        placeholder="피드백을 입력해주세요"
        value={feedback}
        onChange={onChange}
        disabled={isPending}
      />

      <button
        className="feedback-form__submit-button"
        onClick={onSubmit}
        disabled={isPending || !selectedType || feedback.trim() === ""}
      >
        {isPending ? "등록 중..." : "등록"}
      </button>
    </>
  );
}
