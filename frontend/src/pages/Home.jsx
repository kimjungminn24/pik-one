import { useNavigate } from "react-router-dom";
import "../css/home.scss";
import ReportComponent from "../components/report/ReportComponent";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const handleShow = () => {
    setIsReportOpen((prev) => !prev);
  };
  const messages = t("home.messages", { returnObjects: true });

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="home">
      <div className="home__content-row">
        <div>
          <div className="image-container">
            <img
              src="/cute-200.webp"
              srcSet="/cute-200.webp 1x, /cute-320.webp 2x"
              width="320"
              height="200"
              alt="피크민짤"
              className="home__gif"
            />
            <small className="image-credit">
              <a
                href="https://www.instagram.com/sarii_illustration/"
                target="_blank"
                rel="noopener noreferrer"
              >
                @sarii_illustration
              </a>
            </small>
          </div>

          <p className="home__description">{t("home.desc")}</p>
          <p className="home__inspiration-text emoji">{randomMessage}</p>
        </div>

        <div className="home__button-group">
          <button
            onClick={() => navigate("/register")}
            className="home__button peach emoji"
          >
            {t("home.register")}
          </button>

          <button
            onClick={() => navigate("/find")}
            className="home__button blue emoji"
          >
            {t("home.find")}
          </button>

          <button
            onClick={() => handleShow()}
            className="home__button green emoji"
          >
            {t("home.feedback")}
          </button>
        </div>
      </div>
      <div className={`report-wrapper ${isReportOpen ? "show" : ""}`}>
        <ReportComponent enabled={isReportOpen} />
      </div>
    </div>
  );
}
