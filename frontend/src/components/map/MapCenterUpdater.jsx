import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useLocationStore } from "../../store/useLocationStore";

export function MapCenterUpdater() {
  const map = useMap();
  const { bounds, isExternalUpdate } = useLocationStore();

  useEffect(() => {
    if (!isExternalUpdate) return;
    const centerLat = (Number(bounds.northLat) + Number(bounds.southLat)) / 2;
    const centerLng = (Number(bounds.eastLng) + Number(bounds.westLng)) / 2;
    map.setView([centerLat, centerLng]);
  }, [bounds, isExternalUpdate, map]);

  return null;
}
