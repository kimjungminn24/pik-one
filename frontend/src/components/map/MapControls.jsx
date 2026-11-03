import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";

function useLocate() {
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

function LocateIcon() {
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

export default function MapControls() {
  const map = useMap();
  const { t } = useTranslation();
  const locate = useLocate();
  const ref = useRef(null);
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  useEffect(() => {
    if (!ref.current) return;
    L.DomEvent.disableClickPropagation(ref.current);
    L.DomEvent.disableScrollPropagation(ref.current);
  }, []);

  const atMax = zoom >= map.getMaxZoom();
  const atMin = zoom <= map.getMinZoom();

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control map-controls" ref={ref}>
        <div className="map-controls__zoom" role="group" aria-label={t("map.zoom")}>
          <button
            type="button"
            className="map-controls__button"
            onClick={() => map.zoomIn()}
            disabled={atMax}
            aria-label={t("map.zoom_in")}
            title={t("map.zoom_in")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 3.5v11M3.5 9h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <span className="map-controls__divider" aria-hidden="true" />
          <button
            type="button"
            className="map-controls__button"
            onClick={() => map.zoomOut()}
            disabled={atMin}
            aria-label={t("map.zoom_out")}
            title={t("map.zoom_out")}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3.5 9h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="map-controls__button map-controls__locate"
          onClick={locate}
          aria-label={t("locate.title")}
          title={t("locate.title")}
        >
          <LocateIcon />
        </button>
      </div>
    </div>
  );
}
