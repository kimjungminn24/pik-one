import { useTranslation } from "react-i18next";
import { useDeleteLike, usePostLike } from "../../hooks/useLike";
import { useCallback } from "react";

export default function DecorMetaInfo({
  id,
  probability,
  likeCount,
  likedByMe,
  isAuthor,
}) {
  const { t } = useTranslation();
  const { mutate: postLike, isPending: likePending } = usePostLike();
  const { mutate: deleteLike, isPending: unlikePending } = useDeleteLike();

  const isPending = likePending || unlikePending;

  const handleLikeClick = useCallback(() => {
    if (isPending || isAuthor) return;
    if (likedByMe) {
      deleteLike({ id });
    } else {
      postLike({ id });
    }
  }, [isAuthor, isPending, likedByMe, id, postLike, deleteLike]);

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
          onClick={handleLikeClick}
          disabled={isAuthor || isPending}
          aria-pressed={likedByMe}
          aria-label={likedByMe ? "좋아요 취소" : "좋아요"}
        >
          {likedByMe ? "❤️" : "🤍"}
        </button>
        <span className="decor-meta__like-count">{likeCount}</span>{" "}
      </div>
    </div>
  );
}
