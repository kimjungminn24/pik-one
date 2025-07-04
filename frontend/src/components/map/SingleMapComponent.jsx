import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createCustomIcon } from "../../utils/markerIcon";

function MapUpdater({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export default function SingleMapComponent({ lat, lng, type }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={17}
      scrollWheelZoom={false}
      className="leaflet-mini-container"
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={createCustomIcon(type)} />
      <MapUpdater lat={lat} lng={lng} />
    </MapContainer>
  );
}
