import { useTranslation } from "react-i18next";
import { decorMap } from "../../decorList";

export const formatDistance = (meters, t) =>
  meters < 1000
    ? t("explore.distance_m", { value: Math.round(meters / 10) * 10 })
    : t("explore.distance_km", { value: (meters / 1000).toFixed(1) });

export default function SpotCard({ spot, distance, onSelect, onHover }) {
  const { t } = useTranslation();
  const total = spot.helpfulCount + spot.notFoundCount;
  const probability = total === 0 ? null : Math.round((spot.helpfulCount / total) * 100);

  return (
    <li>
      <button
        type="button"
        className="spot-card"
        onClick={() => onSelect(spot.id)}
        onMouseEnter={() => onHover?.(spot.id)}
        onMouseLeave={() => onHover?.(null)}
        onFocus={() => onHover?.(spot.id)}
        onBlur={() => onHover?.(null)}
      >
        <span
          className="spot-card__emoji emoji"
          aria-hidden="true"
        >
          {decorMap[spot.type]?.emoji ?? "🌱"}
        </span>
        <span className="spot-card__body">
          <span className="spot-card__title">
            <strong>{t(`decor.${spot.type}`)}</strong>
            {distance != null && (
              <span className="spot-card__distance">{formatDistance(distance, t)}</span>
            )}
          </span>
          {spot.content && <span className="spot-card__content">{spot.content}</span>}
          <span
            className={`spot-card__meta ${
              probability == null ? "" : probability >= 70 ? "is-good" : "is-low"
            }`}
          >
            {probability == null
              ? t("explore.no_feedback")
              : t("explore.probability", { value: probability, count: total })}
          </span>
        </span>
      </button>
    </li>
  );
}
