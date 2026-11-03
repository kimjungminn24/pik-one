import React from "react";
import { useTranslation } from "react-i18next";

export default function NicknameBox({
  emoji,
  bgColor,
  nickname,
  onEmojiClick,
  onNicknameChange,
  onRandomize,
}) {
  const { t } = useTranslation();
  return (
    <div className="report-nickname">
      <button
        type="button"
        className="report-avatar report-avatar--button emoji"
        style={{ backgroundColor: bgColor }}
        onClick={onEmojiClick}
        aria-label={t("report.change_emoji")}
      >
        {emoji}
      </button>
      <input
        className="field report-nickname__input"
        value={nickname}
        onChange={(e) => onNicknameChange(e.target.value)}
        aria-label={t("report.nickname")}
      />
      <button type="button" className="btn btn--secondary btn--sm" onClick={onRandomize}>
        {t("report.change")}
      </button>
    </div>
  );
}
