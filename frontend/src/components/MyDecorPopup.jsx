import DecorInfoSection from "./decor/DecorInfoSection";
import FeedbackList from "./decor//FeedbackList";
import { useDeleteDecor } from "../hooks/useDecor";
import React, { Suspense } from "react";
import "../css/popup.scss";
const LazyMap = React.lazy(() => import("./map/SingleMapComponent"));
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
    <div className="my-decor-popup">
      <div className="my-decor-popup__content">
        <div className="my-decor-popup__header">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="delete-button my-decor-popup__delete-button"
          >
            {isPending ? "삭제 중..." : "삭제"}
          </button>
          {data.helpfulCount > 0 && (
            <div className="my-decor-popup__helpful-message">
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
      <div className="my-decor-popup__map">
        <Suspense fallback={<div>지도를 불러오는 중...</div>}>
          <LazyMap lng={data.lng} lat={data.lat} type={data.type} />
        </Suspense>
      </div>
    </div>
  );
}
