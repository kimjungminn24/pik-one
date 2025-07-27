import React from "react";

export default function NicknameBox({
  emoji,
  bgColor,
  nickname,
  onEmojiClick,
  onNicknameChange,
  onRandomize,
}) {
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
        변경
      </div>
    </div>
  );
}
