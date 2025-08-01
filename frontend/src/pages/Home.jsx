import { useNavigate } from "react-router-dom";
import "../css/home.scss";
import ReportComponent from "../components/report/ReportComponent";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const handleShow = () => {
    setIsReportOpen((prev) => !prev);
  };
  const messages = [
    "오늘도 새로운 스팟을 발견해보세요!",
    "작은 발자국이 큰 지도를 만듭니다 🗺️",
    "좋은 장소는 나눌수록 빛나요 🌟",
    "모든 데코를 완성해보세요 💫",
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="home">
      <div className="home__content-row">
        <div>
          <img
            src="/cute-200.webp"
            srcSet="/cute-200.webp 1x,
                   /cute-320.webp 2x"
            width="320"
            height="200"
            alt="피크민짤"
            className="home__gif"
          />

          <p className="home__description">
            나만의 단독 스팟을 등록하고, 다른 사람의 스팟도 발견해보세요!
          </p>
          <p className="home__inspiration-text emoji">{randomMessage}</p>
        </div>

        <div className="home__button-group">
          <button
            onClick={() => navigate("/register")}
            className="home__button peach emoji"
          >
            단독 스팟을 등록해보세요 🌿
          </button>

          <button
            onClick={() => navigate("/find")}
            className="home__button blue emoji"
          >
            단독 스팟을 검색해보세요 🔍
          </button>

          <button
            onClick={() => handleShow()}
            className="home__button green emoji"
          >
            여러분의 의견을 들려주세요 💬
          </button>
        </div>
      </div>
      <div className={`report-wrapper ${isReportOpen ? "show" : ""}`}>
        <ReportComponent enabled={isReportOpen} />
      </div>
    </div>
  );
}
