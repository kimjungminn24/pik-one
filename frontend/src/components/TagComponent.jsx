import React from "react";

export default function Tag({ item, onClick, isSelected }) {
  return (
    <div
      className={`tag-container ${isSelected ? "selected" : ""}`}
      onClick={() => onClick?.(item)}
    >
      <div className="tag-name">{item.ko}</div>
      <div className="tag-emoji emoji">{item.emoji}</div>
    </div>
  );
}
