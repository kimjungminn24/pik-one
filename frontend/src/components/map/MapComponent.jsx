import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocateButton } from "./LocateButton";
import { LocationMarker } from "./LocationMarker";
import { FetchOnMove } from "./FetchOnMove";
import { useDecorDetail } from "../../hooks/useDecor";
import DecorDetailPopup from "../decor/DecorDetailPopup";
import { createCustomIcon } from "../../utils/markerIcon";
import { SearchBox } from "./SearchBox";
import "../../css/map.scss";

export default function MapComponent({
  searchResults = [],
  showLocationMarker = true,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const { data, isLoading, isError } = useDecorDetail(selectedId, !!selectedId);

  return (
    <>
      <MapContainer
        center={[37.5665, 126.978]}
        zoom={15}
        minZoom={10}
        maxZoom={20}
        className="map__container"
      >
        <SearchBox />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={20}
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
      {selectedId && data && !isLoading && !isError && (
        <div className="popup">
          <button
            className="popup__close-button"
            onClick={() => setSelectedId(null)}
          >
            ✕
          </button>
          <DecorDetailPopup data={data} />
        </div>
      )}
    </>
  );
}
