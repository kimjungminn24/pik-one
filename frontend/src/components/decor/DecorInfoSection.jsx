import { useTranslation } from "react-i18next";
import { decorMap } from "../../decorList";

export default function DecorInfoSection({
  type,
  lat,
  lng,
  probability,
  content,
}) {
  const { t } = useTranslation();
  const decor = decorMap[type];
  const displayName = t(`decor.${type}`, { defaultValue: decor?.ko ?? type });
  const handleCopyAll = () => {
    const text = `${lat}, ${lng}`;
    navigator.clipboard.writeText(text);
  };
  return (
    <div className="decor-info">
      <div className="decor-info__header">
        <div>
          <strong className="decor-info__type">{displayName}</strong>
          <button className="decor-info__copy " onClick={handleCopyAll}>
            {t("decor_info.copyCoordinates")}
          </button>
        </div>

        <span className="decor-info__probability">
          <span className="emoji">🌱</span> {t("decor_info.probability")}:{" "}
          {probability === null ? "-" : `${probability}%`}{" "}
        </span>
      </div>

      <p className="decor-info__content">{content} </p>

      <div className="decor-info__coordinates">
        <p>
          <span className="emoji">📍</span> {t("decor_info.latitude")}: {lat}
        </p>
        <p>
          <span className="emoji">📍</span> {t("decor_info.longitude")}: {lng}
        </p>
      </div>
    </div>
  );
}
