import React, { useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocateButton } from "./LocateButton";
import { LocationMarker } from "./LocationMarker";
import { FetchOnMove } from "./FetchOnMove";
import { useDecorDetail } from "../../hooks/useDecor";
import DecorDetailPopup from "../decor/DecorDetailPopup";
import SpotMarkers from "./SpotMarkers";
import { TILE_ATTRIBUTION, TILE_OPTIONS, TILE_URL } from "../../utils/mapTiles";
import { SearchBox } from "./SearchBox";
import "../../css/map.scss";
import { useLocationStore } from "../../store/useLocationStore";
import { MapCenterUpdater } from "./MapCenterUpdater";
import ZoomTracker from "./ZoomTracker";

export default function MapComponent({
  searchResults = [],
  showLocationMarker = true,
  showSearchBox = true,
  zoomControlPosition = "topleft",
  locatePosition = "topright",
  selectedId: controlledSelectedId,
  highlightId,
  onSelect,
  children,
}) {
  const isControlled = typeof onSelect === "function";
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const selectedId = isControlled ? controlledSelectedId : internalSelectedId;

  const { data, isLoading, isError } = useDecorDetail(
    internalSelectedId,
    !isControlled && !!internalSelectedId
  );
  const { bounds, zoom } = useLocationStore();
  const initialCenter = [
    (Number(bounds.northLat) + Number(bounds.southLat)) / 2,
    (Number(bounds.eastLng) + Number(bounds.westLng)) / 2,
  ];

  const handleMarkerClick = (id) => {
    if (isControlled) onSelect(id);
    else setInternalSelectedId(id);
  };

  return (
    <>
      <MapContainer
        center={initialCenter}
        zoom={zoom || 15}
        minZoom={2}
        maxZoom={20}
        zoomControl={false}
        className="map__container"
      >
        {zoomControlPosition && <ZoomControl position={zoomControlPosition} />}
        <ZoomTracker />
        <MapCenterUpdater />
        {showSearchBox && <SearchBox />}

        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={TILE_URL}
          {...TILE_OPTIONS}
          maxZoom={20}
          keepBuffer={4}
        />

        <SpotMarkers
          spots={searchResults}
          selectedId={selectedId}
          highlightId={highlightId}
          onSelect={handleMarkerClick}
        />

        {showLocationMarker && <LocationMarker />}
        {locatePosition && <LocateButton position={locatePosition} />}
        <FetchOnMove />
        {children}
      </MapContainer>
      {!isControlled && internalSelectedId && data && !isLoading && !isError && (
        <div className="popup">
          <button
            className="popup__close-button"
            onClick={() => setInternalSelectedId(null)}
          >
            ✕
          </button>
          <DecorDetailPopup feedbacks={data.feedbacks} data={data} />
        </div>
      )}
    </>
  );
}
