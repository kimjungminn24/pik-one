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
      <div
        className="report-nickname-emoji emoji"
        style={{ backgroundColor: bgColor }}
        onClick={onEmojiClick}
      >
        {emoji}
      </div>
      <input
        className="report-nickname-input"
        value={nickname}
        onChange={(e) => onNicknameChange(e.target.value)}
      />
      <div className="report-nickname-btn" onClick={onRandomize}>
        {t("report.change")}
      </div>
    </div>
  );
}
