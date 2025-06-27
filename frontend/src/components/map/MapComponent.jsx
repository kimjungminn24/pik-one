import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocateButton } from "./LocateButton";
import { LocationMarker } from "./LocationMarker";
import { customIcon } from "../../utils/markerIcon";
import { FetchOnMove } from "./FetchOnMove";

export default function MapComponent({ searchResults = [] }) {
  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={13}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {searchResults.map((item) => (
        <Marker
          key={`${item.id}-${item.type}`}
          position={[item.lat, item.lng]}
          icon={customIcon}
        >
          <Popup>
            {item.type} <br />
            {item.lat}, {item.lng}
          </Popup>
        </Marker>
      ))}

      <LocationMarker />
      <LocateButton />
      <FetchOnMove />
    </MapContainer>
  );
}
