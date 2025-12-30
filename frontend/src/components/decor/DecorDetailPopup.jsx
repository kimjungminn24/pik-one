import React, { useEffect, useState } from "react";
import { useCreateFeedback } from "../../hooks/useDecor";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUserStore";

import DecorInfoSection from "./DecorInfoSection";
import FeedbackList from "./FeedbackList";
import FeedbackButtons from "./FeedbackButtons";
import FeedbackForm from "./FeedbackForm";

import { toast } from "react-toastify";
import "../../css/feedback.scss";
import "../../css/popup.scss";
import { useTranslation } from "react-i18next";

export default function DecorDetailPopup({ data, feedbacks }) {
  const [feedback, setFeedback] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const helpfulCount = data.feedbacks.filter(
    (f) => f.type === "HELPFUL"
  ).length;
  const notFoundCount = data.feedbacks.filter(
    (f) => f.type === "NOT_FOUND"
  ).length;
  const [tempHelpfulAdd, setTempHelpfulAdd] = useState(0);
  const [tempNotFoundAdd, setTempNotFoundAdd] = useState(0);

  const isLogin = useUserStore((state) => state.isLogin);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const displayedHelpful = helpfulCount + tempHelpfulAdd;
  const displayedNotFound = notFoundCount + tempNotFoundAdd;
  const total = displayedHelpful + displayedNotFound;
  const probability =
    total === 0 ? null : ((displayedHelpful / total) * 100).toFixed(1);

  const resetFeedbackState = () => {
    setFeedback("");
    setSelectedType("");
    setTempHelpfulAdd(0);
    setTempNotFoundAdd(0);
  };

  const handleTypeClick = (type) => {
    if (!isLogin || selectedType === type) return;
    setSelectedType(type);
    setTempHelpfulAdd(type === "HELPFUL" ? 1 : 0);
    setTempNotFoundAdd(type === "NOT_FOUND" ? 1 : 0);
  };

  const onSuccess = (newFeedback) => {
    toast.success(t("toast.feedback_success"));
    resetFeedbackState();
    queryClient.invalidateQueries({ queryKey: ["decor", data.id] });
  };

  const { mutate, isPending } = useCreateFeedback(onSuccess);

  const handleSubmit = () => {
    if (!feedback.trim() || !selectedType) {
      toast.error(t("toast.feedback_input_error"));
      return;
    }

    mutate({
      decorId: data.id,
      content: feedback,
      feedbackType: selectedType,
    });
  };

  useEffect(() => {
    resetFeedbackState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id]);

  return (
    <>
      <DecorInfoSection
        type={data.type}
        lat={data.lat}
        lng={data.lng}
        probability={probability}
        content={data.content}
      />

      <div className="feedback-list">
        <FeedbackList feedbacks={feedbacks} />
      </div>

      <FeedbackButtons
        selectedType={selectedType}
        isPending={isPending}
        displayedHelpful={displayedHelpful}
        displayedNotFound={displayedNotFound}
        onClick={handleTypeClick}
      />

      {isLogin && (
        <FeedbackForm
          feedback={feedback}
          selectedType={selectedType}
          isPending={isPending}
          onChange={(e) => setFeedback(e.target.value)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
