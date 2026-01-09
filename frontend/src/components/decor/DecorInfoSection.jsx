import { useTranslation } from "react-i18next";
import { decorMap } from "../../decorList";
import "../../css/decor.scss";
import DecorMetaInfo from "./DecorMetaInfo";

export default function DecorInfoSection({ data, probability }) {
  const { t } = useTranslation();
  const decor = decorMap[data.type];
  const displayName = t(`decor.${data.type}`, {
    defaultValue: decor?.ko ?? data.type,
  });
  const handleCopyAll = () => {
    const text = `${data.lat}, ${data.lng}`;
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

        <DecorMetaInfo
          id={data.id}
          probability={probability}
          likeCount={data.likeCount}
          likedByMe={data.isLikedByMe}
          isAuthor={data.isAuthor}
        />
      </div>

      <p className="decor-info__content">{data.content} </p>

      <div className="decor-info__coordinates">
        <p>
          <span className="emoji">📍</span> {t("decor_info.latitude")}:{" "}
          {data.lat}
        </p>
        <p>
          <span className="emoji">📍</span> {t("decor_info.longitude")}:{" "}
          {data.lng}
        </p>
      </div>
    </div>
  );
}
