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
  return (
    <div className="decor-info">
      <div className="decor-info__header">
        <strong className="decor-info__type">{displayName}</strong>
        <span className="decor-info__probability emoji">
          🌱 {t("decor_info.probability")}:{" "}
          {probability === null ? "-" : `${probability}%`}{" "}
        </span>
      </div>

      <p className="decor-info__content">{content} </p>

      <div className="decor-info__coordinates emoji">
        <p>
          📍 {t("decor_info.latitude")}: {lat}
        </p>
        <p>
          📍 {t("decor_info.longitude")}: {lng}
        </p>
      </div>
    </div>
  );
}
