import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";

export function LocateButton() {
  const map = useMap();
  const { t } = useTranslation();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert(t("locate.error_no_geolocation"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 16, {
          duration: 1.5,
        });
      },
      () => {
        alert(t("locate.error_no_position"));
      }
    );
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div
        className="leaflet-control locate-button emoji"
        onClick={handleLocate}
        title={t("locate.title")}
      >
        📍
      </div>
    </div>
  );
}
