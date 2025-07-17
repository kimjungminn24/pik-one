import React, { useEffect, useState } from "react";
import { useCreateFeedback } from "../../hooks/useDecor";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUserStore";

import DecorInfoSection from "./DecorInfoSection";
import FeedbackList from "./FeedbackList";
import FeedbackButtons from "./FeedbackButtons";
import FeedbackForm from "./FeedbackForm";

import { toast } from "react-toastify";
import "../../css/decor.scss";
import "../../css/feedback.scss";

export default function DecorDetailPopup({ data }) {
  const [feedback, setFeedback] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [feedbacks, setFeedbacks] = useState(data.feedbacks ?? []);
  const [helpfulCount, setHelpfulCount] = useState(data.helpfulCount ?? 0);
  const [notFoundCount, setNotFoundCount] = useState(data.notFoundCount ?? 0);
  const [tempHelpfulAdd, setTempHelpfulAdd] = useState(0);
  const [tempNotFoundAdd, setTempNotFoundAdd] = useState(0);

  const isLogin = useUserStore((state) => state.isLogin);
  const queryClient = useQueryClient();

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
    toast.success("피드백이 성공적으로 등록되었어요!");
    setFeedbacks((prev) => [...prev, newFeedback]);
    if (newFeedback.type === "HELPFUL") setHelpfulCount((prev) => prev + 1);
    else setNotFoundCount((prev) => prev + 1);
    resetFeedbackState();
    queryClient.invalidateQueries({ queryKey: ["decor", data.id] });
  };

  const { mutate, isPending } = useCreateFeedback(onSuccess);

  const handleSubmit = () => {
    if (!feedback.trim() || !selectedType) {
      toast.error("버튼과 피드백을 모두 입력해주세요.");
      return;
    }

    mutate({
      decorId: data.id,
      content: feedback,
      feedbackType: selectedType,
    });
  };

  useEffect(() => {
    setFeedbacks(data.feedbacks ?? []);
    setHelpfulCount(data.helpfulCount ?? 0);
    setNotFoundCount(data.notFoundCount ?? 0);
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
