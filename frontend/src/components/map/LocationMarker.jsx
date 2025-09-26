import { useMapEvents, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { createCustomIcon } from "../../utils/markerIcon";

export function LocationMarker() {
  const { lat, lng, setLocation } = useLocationStore();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      setPosition([parseFloat(lat), parseFloat(lng)]);
    }
  }, [lat, lng]);

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
