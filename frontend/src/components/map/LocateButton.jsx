import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";

const POSITION_CLASS = {
  topright: "leaflet-top leaflet-right",
  bottomright: "leaflet-bottom leaflet-right",
};

export function useLocate() {
  const map = useMap();
  const { t } = useTranslation();

  return () => {
    if (!navigator.geolocation) {
      alert(t("locate.error_no_geolocation"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 16, {
          duration: 1.5,
        });
      },
      () => {
        alert(t("locate.error_no_position"));
      }
    );
  };
}

export function LocateIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="5.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="10" r="1.75" fill="currentColor" />
      <path
        d="M10 1.5v2.75M10 15.75v2.75M1.5 10h2.75M15.75 10h2.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LocateButton({ position = "topright" }) {
  const { t } = useTranslation();
  const locate = useLocate();

  return (
    <div className={POSITION_CLASS[position] ?? POSITION_CLASS.topright}>
      <button
        type="button"
        className="leaflet-control locate-button"
        onClick={locate}
        title={t("locate.title")}
        aria-label={t("locate.title")}
      >
        <LocateIcon />
      </button>
    </div>
  );
}
