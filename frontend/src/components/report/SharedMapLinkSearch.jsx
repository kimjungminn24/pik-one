import React, { useEffect, useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";

export default function SharedMapLinkSearch() {
  const { setLocation, setBounds, setIsExternalUpdate } = useLocationStore();

  const [url, setUrl] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    const lat = 37.5665;
    const lng = 126.978;
    setIsExternalUpdate(true);

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    console.log(parsedLat, parsedLat);
    setLocation(parsedLat, parsedLng);
    const offset = 0.01;
    setBounds({
      northLat: parsedLat + offset,
      southLat: parsedLat - offset,
      eastLng: parsedLng + offset,
      westLng: parsedLng - offset,
    });
    setTimeout(() => setIsExternalUpdate(false), 500);
  };

  return (
    <form onSubmit={handleSubmit} className="coordinate-register-form">
      <div className="coordinate-register-form-outer">
        <div className="coordinate-register-form-label emoji">
          공유 링크로 좌표 조회하기
        </div>

        <input
          value={url}
          className="coordinate-register-form-input"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <button type="submit">조회</button>
    </form>
  );
}
