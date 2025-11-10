import React, { useState } from "react";
import { useMyDecorsQuery } from "../hooks/useDecor";
import { decorMap } from "../decorList";
import DecorCard from "../components/DecorCard";
import MyDecorPopup from "../components/MyDecorPopup";
import "../css/mypage.scss";
import { useTranslation } from "react-i18next";

export default function MyPage() {
  const { t } = useTranslation();

  const { data, isLoading } = useMyDecorsQuery();
  const [selectedDecor, setSelectedDecor] = useState(null);

  if (isLoading) return <div>{t("common.loading")}</div>;

  return (
    <div className="page-layout">
      <div className="page-section emoji">
        <div>
          <h2>📍 {t("mypage.title")}</h2>
          {data && data.length > 0 ? (
            <div className="decor-grid">
              {data.map((decor) => {
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
    </div>
  );
}
