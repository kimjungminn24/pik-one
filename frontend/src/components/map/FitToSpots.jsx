import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

export default function FitToSpots({ spots, padding = [48, 48], maxZoom = 16 }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !spots?.length) return;
    done.current = true;
    if (spots.length === 1) {
      map.setView([spots[0].lat, spots[0].lng], maxZoom);
      return;
    }
    const bounds = L.latLngBounds(spots.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding, maxZoom });
  }, [map, spots, padding, maxZoom]);

  return null;
}
