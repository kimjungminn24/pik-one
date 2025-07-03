import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocateButton } from "./LocateButton";
import { LocationMarker } from "./LocationMarker";
import { customIcon } from "../../utils/markerIcon";
import { FetchOnMove } from "./FetchOnMove";
import { createCustomIcon } from "../../utils/markerIcon";

export default function MapComponent({
  searchResults = [],
  showLocationMarker = true,
}) {
  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={13}
      className="leaflet-container"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {searchResults.map((item) => (
        <Marker
          key={`${item.id}-${item.type}`}
          position={[item.lat, item.lng]}
            icon={createCustomIcon(item.type, item.id === selectedId)}
            eventHandlers={{
              click: () => setSelectedId(item.id),
            }}
          />
      ))}

        {showLocationMarker && <LocationMarker />}
      <LocateButton />
      <FetchOnMove />
    </MapContainer>
  );
}
