import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const messages = [
    "오늘도 새로운 스팟을 발견해보세요!",
    "작은 발자국이 큰 지도를 만듭니다 🗺️",
    "좋은 장소는 나눌수록 빛나요 🌟",
    "모든 데코를 완성해보세요 💫",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="home-container">
      <div className="content-row">
        <div className="intro-section">
          <img src="/cute.gif" className="home-gif" />
          <p className="home-description">
            나만의 단독 스팟을 등록하고, 다른 사람의 스팟도 발견해보세요!
          </p>
          <p className="inspiration-text emoji">{randomMessage}</p>
        </div>

        <div className="button-group">
          <button
            onClick={() => navigate("/register")}
            className="home-button peach uniform-box emoji"
          >
            단독 스팟을 등록해보세요 🌿
          </button>

          <button
            onClick={() => navigate("/find")}
            className="home-button blue uniform-box emoji"
          >
            단독 스팟을 검색해보세요 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
