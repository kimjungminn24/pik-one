import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { decorMap } from "../../decorList";
import {
  useCreateFeedback,
  useDecorDetail,
  useDeleteDecor,
  useDeleteFeedback,
} from "../../hooks/useDecor";
import { useDeleteLike, usePostLike } from "../../hooks/useLike";
import { useUserStore } from "../../store/useUserStore";
import { hasAnonVote, rememberAnonVote } from "../../utils/anonVotes";

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M11 4 6 9l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M10 16.5s-6-3.6-6-8.1A3.4 3.4 0 0 1 10 6.2a3.4 3.4 0 0 1 6 2.2c0 4.5-6 8.1-6 8.1Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SpotDetail({ id, onBack, onDeleted, hideBack = false }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isLogin = useUserStore((state) => state.isLogin);
  const { data, isLoading, isError } = useDecorDetail(id, !!id);

  const [vote, setVote] = useState(null); // "HELPFUL" | "NOT_FOUND"
  const [comment, setComment] = useState("");

  useEffect(() => {
    setVote(null);
    setComment("");
  }, [id]);

  const refreshSpot = () => queryClient.invalidateQueries({ queryKey: ["decor"] });

  const { mutate: createFeedback, isPending: isSending } = useCreateFeedback((sent) => {
    if (!isLogin) rememberAnonVote(sent.decorId);
    toast.success(t("spot.sent"));
    setVote(null);
    setComment("");
    refreshSpot();
  });
  const { mutate: deleteFeedback } = useDeleteFeedback();
  const { mutate: deleteSpot, isPending: isDeleting } = useDeleteDecor();

  const removeSpot = () => {
    if (!window.confirm(t("popup.delete_confirm"))) return;
    deleteSpot(
      { id },
      {
        onSuccess: () => onDeleted?.(),
      }
    );
  };
  const { mutate: postLike, isPending: liking } = usePostLike();
  const { mutate: deleteLike, isPending: unliking } = useDeleteLike();

  const header = hideBack ? null : (
    <button type="button" className="spot-detail__back" onClick={onBack}>
      <BackIcon />
      {t("explore.back")}
    </button>
  );

  if (isLoading || isError || !data) {
    return (
      <div className="spot-detail">
        {header}
        <p className="explore__hint">
          {isError ? t("toast.error") : t("common.loading")}
        </p>
      </div>
    );
  }

  const feedbacks = data.feedbacks ?? [];
  const found = feedbacks.filter((f) => f.type === "HELPFUL").length;
  const notFound = feedbacks.length - found;
  const probability = feedbacks.length ? Math.round((found / feedbacks.length) * 100) : null;
  const tone = probability == null ? "none" : probability >= 70 ? "good" : "low";
  const alreadyVoted = feedbacks.some((f) => f.isAuthor) || (!isLogin && hasAnonVote(data.id));
  const coords = `${Number(data.lat).toFixed(6)}, ${Number(data.lng).toFixed(6)}`;

  const copyCoords = async () => {
    try {
      await navigator.clipboard.writeText(coords);
      toast.success(t("spot.copied"));
    } catch {
      toast.error(t("toast.error"));
    }
  };

  const toggleLike = () => {
    if (data.isAuthor || liking || unliking) return;
    (data.isLikedByMe ? deleteLike : postLike)({ id: data.id });
  };

  const submitVote = () => {
    if (!vote || isSending) return;
    createFeedback({ decorId: data.id, feedbackType: vote, content: comment.trim() });
  };

  return (
    <div className="spot-detail">
      {header}

      <section className="spot-detail__hero">
        <span
          className="spot-detail__emoji emoji"
          aria-hidden="true"
        >
          {decorMap[data.type]?.emoji ?? "🌱"}
        </span>
        <div className="spot-detail__heading">
          <h3 className="spot-detail__name">{t(`decor.${data.type}`)}</h3>
          {data.anonymous && <span className="anon-badge">{t("spot.anonymous")}</span>}
        </div>
        <button
          type="button"
          className={`spot-detail__like ${data.isLikedByMe ? "is-on" : ""}`}
          onClick={toggleLike}
          disabled={!isLogin || data.isAuthor}
          aria-pressed={!!data.isLikedByMe}
          aria-label={t(data.isLikedByMe ? "spot.unlike" : "spot.like")}
        >
          <HeartIcon filled={data.isLikedByMe} />
          <span>{data.likeCount}</span>
        </button>
      </section>

      {data.content && <p className="spot-detail__desc">{data.content}</p>}

      {probability != null && (
        <section className={`spot-detail__prob is-${tone}`}>
            <div className="spot-detail__prob-row">
              <span className="spot-detail__prob-label">{t("spot.probability")}</span>
              <strong className="spot-detail__prob-value">{probability}%</strong>
            </div>
            <div
              className="spot-detail__bar"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={probability}
              aria-label={t("spot.probability")}
            >
              <span style={{ width: `${probability}%` }} />
            </div>
            <span className="spot-detail__prob-sub">
              {t("spot.votes", { found, notFound })}
            </span>
        </section>
      )}

      <section className="spot-detail__coords">
        <span className="spot-detail__coords-label">{t("spot.coords")}</span>
        <span className="spot-detail__coords-value">{coords}</span>
        <button type="button" className="spot-detail__chip-btn" onClick={copyCoords}>
          {t("spot.copy")}
        </button>
      </section>

      <section className="spot-detail__vote">
        {probability == null && (
          <p className="spot-detail__no-votes">{t("spot.no_votes")}</p>
        )}
        <h4 className="spot-detail__section-title">{t("spot.ask")}</h4>

        {alreadyVoted ? (
          <p className="spot-detail__muted">{t("spot.already")}</p>
        ) : (
          <>
            <div className={`spot-detail__vote-buttons ${vote ? "has-vote" : ""}`}>
              {[
                ["HELPFUL", "found", "😊", found],
                ["NOT_FOUND", "not_found", "😢", notFound],
              ].map(([type, key, emoji, count]) => (
                <button
                  key={type}
                  type="button"
                  className={`spot-detail__vote-btn is-${key} ${vote === type ? "is-selected" : ""}`}
                  aria-pressed={vote === type}
                  onClick={() => setVote((prev) => (prev === type ? null : type))}
                >
                  <span className="spot-detail__vote-check" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="spot-detail__vote-emoji emoji" aria-hidden="true">{emoji}</span>
                  <span className="spot-detail__vote-label">{t(`spot.${key}`)}</span>
                  {count > 0 && (
                    <span className="spot-detail__vote-count">{t("spot.people", { count })}</span>
                  )}
                </button>
              ))}
            </div>

            {vote && (
              <div className="spot-detail__compose">
                <textarea
                  className="spot-detail__textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("spot.comment_placeholder")}
                  maxLength={500}
                  rows={2}
                />
                <button
                  type="button"
                  className="spot-detail__submit"
                  onClick={submitVote}
                  disabled={isSending}
                >
                  {isSending ? t("spot.submitting") : t("spot.submit")}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {feedbacks.length > 0 && (
        <section className="spot-detail__reviews">
          <h4 className="spot-detail__section-title">
            {t("spot.reviews_title", { count: feedbacks.length })}
          </h4>
          <ul>
            {feedbacks.map((f) => {
              const key = f.type === "HELPFUL" ? "found" : "not_found";
              return (
                <li key={f.id} className={`spot-detail__review is-${key}`}>
                  <span className="spot-detail__review-emoji emoji" aria-hidden="true">
                    {f.type === "HELPFUL" ? "😊" : "😢"}
                  </span>
                  <div className="spot-detail__review-body">
                    <div className="spot-detail__review-head">
                      <strong className="spot-detail__review-result">
                        {t(`spot.${key}`)}
                      </strong>
                      {f.isAuthor && (
                        <span className="spot-detail__review-mine">{t("spot.mine")}</span>
                      )}
                      {f.anonymous && <span className="anon-badge">{t("spot.anonymous")}</span>}
                    </div>
                    {f.content && <p className="spot-detail__review-text">{f.content}</p>}
                  </div>
                  {f.isAuthor && (
                    <button
                      type="button"
                      className="spot-detail__review-delete"
                      onClick={() =>
                        deleteFeedback(
                          { id: f.id, decorId: data.id },
                          { onSuccess: refreshSpot }
                        )
                      }
                    >
                      {t("spot.delete")}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {data.isAuthor && (
        <div className="spot-detail__owner">
          <button
            type="button"
            className="spot-detail__owner-delete"
            disabled={isDeleting}
            onClick={removeSpot}
          >
            {isDeleting ? t("popup.delete_loading") : t("spot.delete_spot")}
          </button>
        </div>
      )}
    </div>
  );
}
