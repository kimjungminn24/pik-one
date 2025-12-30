import React, { useState } from "react";
import { useMyDecorsQuery, useMyFeedbacksQuery } from "../hooks/useDecor";
import { decorMap } from "../decorList";
import DecorCard from "../components/DecorCard";
import MyDecorPopup from "../components/MyDecorPopup";
import "../css/mypage.scss";
import { useTranslation } from "react-i18next";
import MyFeedbackList from "../components/MyFeedbackList";
import DecorDetailPopup from "../components/decor/DecorDetailPopup";

export default function MyPage() {
  const { t } = useTranslation();

  const { data: decorsData, isLoading: decorsLoading } = useMyDecorsQuery();
  const { data: feedbacksData, isLoading: feedbacksLoading } =
    useMyFeedbacksQuery();

  const [selectedDecor, setSelectedDecor] = useState(null);
  const [selectedFeedbackDecor, setSelectedFeedbackDecor] = useState(null);

  if (decorsLoading) return <div>{t("common.loading")}</div>;
  if (feedbacksLoading) return <div>{t("common.loading")}</div>;

  return (
    <div className="page-layout">
      <div className="page-section">
        <div>
          <h3>
            <span className="emoji">📍 </span>
            {t("mypage.title")}
          </h3>
          {decorsData && decorsData.length > 0 ? (
            <div className="decor-grid">
              {decorsData.map((decor) => {
                const matched = decorMap[decor.type];
                return (
                  <div key={decor.id} onClick={() => setSelectedDecor(decor)}>
                    <DecorCard
                      key={decor.id}
                      type={t(`decor.${decor.type}`, {
                        defaultValue: matched?.ko ?? decor.type,
                      })}
                      content={decor.content}
                      emoji={matched?.emoji}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div>{t("mypage.no_results")}</div>
          )}
        </div>
        <div>
          <h3>
            <span className="emoji">📍 </span>
            {t("mypage.feedback")}
          </h3>
          <MyFeedbackList
            onSelectDecor={setSelectedFeedbackDecor}
            feedbacks={feedbacksData}
          />
        </div>
      </div>

      {selectedDecor && (
        <div className="popup">
          <button
            className="popup__close-button"
            onClick={() => setSelectedDecor(null)}
          >
            ✕
          </button>
          <MyDecorPopup
            data={selectedDecor}
            onClose={() => setSelectedDecor(null)}
          />
        </div>
      )}
      {selectedFeedbackDecor && (
        <div className="popup">
          <button
            className="popup__close-button"
            onClick={() => setSelectedFeedbackDecor(null)}
          >
            ✕
          </button>
          <DecorDetailPopup
            feedbacks={selectedFeedbackDecor.feedbacks}
            data={selectedFeedbackDecor}
            onClose={() => setSelectedFeedbackDecor(null)}
          />
        </div>
      )}
    </div>
  );
}
