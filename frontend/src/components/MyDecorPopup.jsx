import DecorInfoSection from "./decor/DecorInfoSection";
import FeedbackList from "./decor//FeedbackList";
import { useDeleteDecor } from "../hooks/useDecor";
import React, { Suspense } from "react";
import "../css/popup.scss";
import { useTranslation } from "react-i18next";
const LazyMap = React.lazy(() => import("./map/SingleMapComponent"));
export default function MyDecorPopup({ data, onClose }) {
  const total = data.helpfulCount + data.notFoundCount;
  const probability =
    total === 0 ? null : ((data.helpfulCount / total) * 100).toFixed(1);

  const { mutate: deleteMutate, isPending } = useDeleteDecor();
  const { t } = useTranslation();
  const handleDelete = () => {
    if (window.confirm(t("popup.delete_confirm"))) {
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
            {isPending ? t("popup.delete_loading") : t("popup.delete")}
          </button>
          {data.helpfulCount > 0 && (
            <div className="my-decor-popup__helpful-message">
              {t("popup.helpful_message", { count: data.helpfulCount })}
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
        <Suspense fallback={<div>{t("popup.loading_map")}</div>}>
          <LazyMap lng={data.lng} lat={data.lat} type={data.type} />
        </Suspense>
      </div>
    </div>
  );
}
