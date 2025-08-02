import React from "react";

export default function LoadingSpinner({ message = "로딩 중입니다..." }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner" />
      <div className="loading-text">{message}</div>
    </div>
  );
}
