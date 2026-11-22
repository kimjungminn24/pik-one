import { useMapEvents, Marker } from "react-leaflet";
import { useLocationStore } from "../../store/useLocationStore";
import { createCustomIcon } from "../../utils/markerIcon";

export function LocationMarker() {
  const { lat, lng, setLocation } = useLocationStore();

  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  return lat != null && lng != null ? (
    <Marker position={[lat, lng]} icon={createCustomIcon("DEFAULT")} />
  ) : null;
}
