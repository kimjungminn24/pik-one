import React from "react";

export default function DecorCard({ type, content, emoji }) {
  return (
    <div className="decor-card">
      <div className="decor-card__emoji emoji">{emoji ?? "❓"}</div>
      <div className="decor-card__type">{type}</div>
      <div className="decor-card__content">{content}</div>
    </div>
  );
}
