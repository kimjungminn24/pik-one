import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyTo({ target }) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    const zoom = target.zoom ?? Math.max(map.getZoom(), 16);
    const offsetY = target.offsetY ?? 0;

    const point = map.project([target.lat, target.lng], zoom).add([0, offsetY]);
    const center = map.unproject(point, zoom);
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [target?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
