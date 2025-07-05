import React from "react";

export default function DecorCard({ type, content, emoji }) {
  return (
    <div className="decor-card">
      <div className="emoji">{emoji ?? "❓"}</div>
      <div className="type">{type}</div>
      <div className="content">{content}</div>
    </div>
  );
}
