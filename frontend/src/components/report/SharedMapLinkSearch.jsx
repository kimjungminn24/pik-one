import React, { useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useResolveSharedLink } from "../../hooks/useLocation";

export default function SharedMapLinkSearch() {
  const { setLocation, setBounds, setIsExternalUpdate } = useLocationStore();

  const [url, setUrl] = useState("");
  const { mutate, isPending } = useResolveSharedLink();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(url, {
      onSuccess: ({ lat, lng }) => {
        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
          console.error("좌표 파싱 실패");
          return;
        }

        setIsExternalUpdate(true);
        setLocation(parsedLat, parsedLng);

        const offset = 0.03;
        setBounds({
          northLat: parsedLat + offset,
          southLat: parsedLat - offset,
          eastLng: parsedLng + offset,
          westLng: parsedLng - offset,
        });

        setTimeout(() => setIsExternalUpdate(false), 500);
      },
      onError: (err) => {
        console.error("공유 링크 처리 실패", err);
      },
    });
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
