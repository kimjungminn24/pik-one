import React, { useEffect, useState } from "react";
import { useMyDecorsQuery } from "../hooks/useDecor";
import { toast } from "react-toastify";
import { decorList } from "../decorList";
import DecorCard from "../components/DecorCard";
import MyDecorPopup from "../components/MyDecorPopup";
export default function MyPage() {
  const { data, isLoading, isError } = useMyDecorsQuery();
  const [selectedDecor, setSelectedDecor] = useState(null);

  useEffect(() => {
    if (isError) {
      toast.error("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  }, [isError]);

  if (isLoading) return <div> 로딩 중...</div>;

  return (
    <div className="page-layout">
      <div className="register-container">
        <div>
          <h2>📍 내가 찾은 장소들</h2>
          {data && data.length > 0 ? (
            <div className="decor-grid">
              {data.map((decor) => {
                const matched = decorList.find(
                  (item) => item.name === decor.type
                );
                return (
                  <div key={decor.id} onClick={() => setSelectedDecor(decor)}>
                    <DecorCard
                      key={decor.id}
                      type={matched?.ko ?? decor.type}
                      content={decor.content}
                      emoji={matched?.emoji}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div>등록한 장소가 없습니다.</div>
          )}
        </div>
      </div>

      {selectedDecor && (
        <div className="mobile-popup-panel">
          <button
            className="close-button"
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
