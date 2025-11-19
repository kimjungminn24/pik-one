import { useEffect, useState } from "react";
import { useLocationStore } from "../store/useLocationStore";
import { useTranslation } from "react-i18next";

export default function CoordinateRegister() {
  const { t } = useTranslation();

  const {
    lat: storeLat,
    lng: storeLng,
    setLocation,
    setBounds,
    setIsExternalUpdate,
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
      alert(t("coordinate.error_empty"));
      return;
    }
    setIsExternalUpdate(true);
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
    setTimeout(() => setIsExternalUpdate(false), 500);
  };

  return (
    <form onSubmit={handleSubmit} className="coordinate-register-form">
      <div className="coordinate-register-form-outer">
        <div className="coordinate-register-form-label">
          {t("coordinate.latitude")}
        </div>
        <input
          type="number"
          step="0.000001"
          value={lat}
          className="coordinate-register-form-input"
          onChange={(e) => setLat(e.target.value)}
          placeholder={t("coordinate.lat_placeholder")}
        />
      </div>
      <div className="coordinate-register-form-outer">
        <div className="coordinate-register-form-label">
          {t("coordinate.longitude")}
        </div>
        <input
          type="number"
          step="0.000001"
          value={lng}
          className="coordinate-register-form-input"
          onChange={(e) => setLng(e.target.value)}
          placeholder={t("coordinate.lng_placeholder")}
        />
      </div>
      <button type="submit">{t("coordinate.submit")}</button>
    </form>
  );
}
