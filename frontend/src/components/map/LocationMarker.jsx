import { useMapEvents, Marker } from "react-leaflet";
import { useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { createCustomIcon } from "../../utils/markerIcon";

export function LocationMarker() {
  const setLocation = useLocationStore((state) => state.setLocation);
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setLocation(lat.toFixed(6), lng.toFixed(6));
    },
  });

  return position ? (
    <Marker position={position} icon={createCustomIcon("DEFAULT")} />
  ) : null;
}
