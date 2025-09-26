import { useEffect, useState } from "react";
import { useLocationStore } from "../store/useLocationStore";

export default function CoordinateRegister() {
  const {
    lat: storeLat,
    lng: storeLng,
    setLocation,
    setBounds,
  } = useLocationStore();

  const [lat, setLat] = useState(storeLat || "");
  const [lng, setLng] = useState(storeLng || "");

  useEffect(() => {
    setLat(storeLat || "");
  }, [storeLat]);

  useEffect(() => {
    setLng(storeLng || "");
  }, [storeLng]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lat || !lng) {
      alert("위도와 경도를 모두 입력해주세요.");
      return;
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    setLocation(parsedLat, parsedLng);
    const offset = 0.01;
    setBounds({
      northLat: parsedLat + offset,
      southLat: parsedLat - offset,
      eastLng: parsedLng + offset,
      westLng: parsedLng - offset,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="coordinate-register-form">
      <div className="coordinate-register-form-outer">
        <div className="coordinate-register-form-label emoji">위도</div>
        <input
          type="number"
          step="0.000001"
          value={lat}
          className="coordinate-register-form-input"
          onChange={(e) => setLat(e.target.value)}
          placeholder="ex: 37.5665"
        />
      </div>
      <div className="coordinate-register-form-outer">
        <div className="coordinate-register-form-label emoji">경도</div>
        <input
          type="number"
          step="0.000001"
          value={lng}
          className="coordinate-register-form-input"
          onChange={(e) => setLng(e.target.value)}
          placeholder="ex: 126.9780"
        />
      </div>
      <button type="submit">조회</button>
    </form>
  );
}
