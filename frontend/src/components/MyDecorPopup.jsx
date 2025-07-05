import DecorInfoSection from "./decor/DecorInfoSection";
import FeedbackList from "./decor//FeedbackList";
import SingleMapComponent from "./map/SingleMapComponent";
import { useDeleteDecor } from "../hooks/useDecor";

export default function MyDecorPopup({ data, onClose }) {
  const total = data.helpfulCount + data.notFoundCount;
  const probability =
    total === 0 ? null : ((data.helpfulCount / total) * 100).toFixed(1);

  const { mutate: deleteMutate, isPending } = useDeleteDecor();

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutate(
        { id: data.id },
        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    }
  };
  return (
    <div className="popup-container">
      <div className="mypopup-container">
        <div className="mypopup-left">
          <div className="mypopup-left-upper">
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="delete-button"
            >
              {isPending ? "삭제 중..." : "삭제"}
            </button>
            {data.helpfulCount > 0 && (
              <div className="helpful-count">
                {data.helpfulCount}명에게 도움이 되었어요! 😊
              </div>
            )}
          </div>
          <DecorInfoSection
            type={data.type}
            lat={data.lat}
            lng={data.lng}
            probability={probability}
            content={data.content}
          />

          <div className="feedback-list">
            <FeedbackList feedbacks={data.feedbacks} />
          </div>
        </div>
        <div className="mypopup-right">
          <SingleMapComponent lng={data.lng} lat={data.lat} type={data.type} />
        </div>
      </div>
    </div>
  );
}
