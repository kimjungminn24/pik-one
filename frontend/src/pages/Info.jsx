import { useTranslation } from "react-i18next";
import "../css/info.scss";

export default function Info() {
  const { t } = useTranslation();

  return (
    <div className="info-page">
      <div className="info-card">
        <div className="info-header">
          <img src="/pikmin.png" alt="pikmin" className="info-icon" />
          <p className="info-intro">
            {t("info.greeting")}
            <br />
            {t("info.bug")}
            <br />
            {t("info.ask")}
          </p>
        </div>

        <div className="info-details">
          <div className="detail-item">
            <span className="emoji">📨</span>
            <strong>{t("info.email")} :</strong>
            <span className="detail-value">jmeve24@naver.com</span>
          </div>

          <div className="detail-item">
            <span className="emoji">🌱</span>
            <strong>{t("info.friendCode")} :</strong>
            <span className="detail-value">6335-5601-8671</span>
          </div>
        </div>
      </div>
    </div>
  );
}
