import { useEffect, useState } from "react";
import { useLocationStore } from "../store/useLocationStore";
import { useTranslation } from "react-i18next";

// onMove(lat, lng): 입력한 위치로 지도를 옮긴다
export default function CoordinateRegister({ onMove }) {
  const { t } = useTranslation();

  const { lat: storeLat, lng: storeLng, setLocation } = useLocationStore();

  const [lat, setLat] = useState(storeLat ?? "");
  const [lng, setLng] = useState(storeLng ?? "");

  useEffect(() => {
    setLat(storeLat ?? "");
  }, [storeLat]);

  useEffect(() => {
    setLng(storeLng ?? "");
  }, [storeLng]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
      alert(t("coordinate.error_empty"));
      return;
    }
    setLocation(parsedLat, parsedLng);
    onMove?.(parsedLat, parsedLng);
  };

  return (
    <form onSubmit={handleSubmit} className="coord-form">
      <label className="coord-form__item">
        <span className="field-label">{t("coordinate.latitude")}</span>
        <input
          type="number"
          step="0.000001"
          inputMode="decimal"
          value={lat}
          className="field"
          onChange={(e) => setLat(e.target.value)}
          placeholder={t("coordinate.lat_placeholder")}
        />
      </label>
      <label className="coord-form__item">
        <span className="field-label">{t("coordinate.longitude")}</span>
        <input
          type="number"
          step="0.000001"
          inputMode="decimal"
          value={lng}
          className="field"
          onChange={(e) => setLng(e.target.value)}
          placeholder={t("coordinate.lng_placeholder")}
        />
      </label>
      <button type="submit" className="btn btn--secondary coord-form__submit">
        {t("coordinate.submit")}
      </button>
    </form>
  );
}
