import React from "react";
import { useTranslation } from "react-i18next";

export default function Tag({ item, onClick, isSelected }) {
  const { t } = useTranslation();

  return (
    <div
      className={`tag ${isSelected ? "tag-selected" : ""}`}
      onClick={() => onClick?.(item)}
    >
      <div className="tag__name">
        {t(`decor.${item.name}`, { defaultValue: item.ko })}
      </div>
      <div className="tag__emoji emoji">{item.emoji}</div>
    </div>
  );
}
