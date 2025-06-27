import { useMap, useMapEvents } from "react-leaflet";
import { useLocationStore } from "../../store/useLocationStore";

export function FetchOnMove() {
  const map = useMap();
  const setBounds = useLocationStore((state) => state.setBounds);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();

      setBounds({
        northLat: bounds.getNorth().toFixed(6),
        southLat: bounds.getSouth().toFixed(6),
        eastLng: bounds.getEast().toFixed(6),
        westLng: bounds.getWest().toFixed(6),
      });
    },
  });

  return null;
}
