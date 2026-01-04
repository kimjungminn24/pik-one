import { useTranslation } from "react-i18next";

export default function DecorMetaInfo({ probability, likeCount, likedByMe }) {
  const { t } = useTranslation();

  return (
    <div className="decor-meta">
      <span className="decor-meta__probability ">
        <span className="emoji">🌱</span> {t("decor_info.probability")}:{" "}
        {probability === null ? "-" : `${probability}%`}
      </span>
      <div className="decor-meta__like-wrapper">
        <button
          className={
            likedByMe ? "decor-meta__like emoji" : "decor-meta__not-like emoji"
          }
          aria-pressed={likedByMe}
        >
          {likedByMe ? "❤️" : "🤍"}
        </button>
        <span className="decor-meta__like-count">{likeCount}</span>{" "}
      </div>
    </div>
  );
}
