import React from "react";

export default function Tag({ item, onClick, isSelected }) {
  return (
    <div
      className={`tag ${isSelected ? "tag-selected" : ""}`}
      onClick={() => onClick?.(item)}
    >
      <div className="tag__name">{item.ko}</div>
      <div className="tag__emoji emoji">{item.emoji}</div>
    </div>
  );
}
