import { useMapEvents } from "react-leaflet";
import { useLocationStore } from "../../store/useLocationStore";

export default function ZoomTracker() {
  const setZoom = useLocationStore((state) => state.setZoom);

  useMapEvents({
    zoomend(e) {
      const zoom = e.target.getZoom();
      setZoom(zoom);
    },
  });

  return null;
}
