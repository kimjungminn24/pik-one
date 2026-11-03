import { useTranslation } from "react-i18next";
import "../css/tag.scss";

export default function Tag({ item, onClick, isSelected, count, muted = false }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={`tag ${isSelected ? "tag--selected" : ""} ${
        muted && !isSelected ? "tag--muted" : ""
      }`}
      aria-pressed={isSelected}
      onClick={() => onClick?.(item)}
    >
      <span className="tag__emoji emoji" aria-hidden="true">
        {item.emoji}
      </span>
      <span className="tag__name">
        {t(`decor.${item.name}`, { defaultValue: item.ko })}
      </span>
      {count != null && <span className="tag__count">{count}</span>}
    </button>
  );
}
