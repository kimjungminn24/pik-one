import { useMap, useMapEvents } from "react-leaflet";
import { round6, useLocationStore } from "../../store/useLocationStore";

export function FetchOnMove() {
  const map = useMap();
  const setBounds = useLocationStore((state) => state.setBounds);

  useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();

      setBounds({
        northLat: round6(bounds.getNorth()),
        southLat: round6(bounds.getSouth()),
        eastLng: round6(bounds.getEast()),
        westLng: round6(bounds.getWest()),
      });
    },
  });

  return null;
}
