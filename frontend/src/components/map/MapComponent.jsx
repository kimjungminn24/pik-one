import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LocationMarker } from "./LocationMarker";
import { FetchOnMove } from "./FetchOnMove";
import SpotMarkers from "./SpotMarkers";
import { TILE_ATTRIBUTION, TILE_OPTIONS, TILE_URL } from "../../utils/mapTiles";
import "../../css/map.scss";
import { useLocationStore } from "../../store/useLocationStore";
import { MapCenterUpdater } from "./MapCenterUpdater";
import ZoomTracker from "./ZoomTracker";

const NO_SPOTS = [];

export default function MapComponent({
  searchResults = NO_SPOTS,
  showLocationMarker = true,
  selectedId,
  highlightId,
  onSelect,
  children,
}) {
  const { bounds, zoom } = useLocationStore();
  const initialCenter = [
    (Number(bounds.northLat) + Number(bounds.southLat)) / 2,
    (Number(bounds.eastLng) + Number(bounds.westLng)) / 2,
  ];

  return (
    <MapContainer
      center={initialCenter}
      zoom={zoom || 15}
      minZoom={2}
      maxZoom={20}
      zoomControl={false}
      className="map__container"
    >
      <ZoomTracker />
      <MapCenterUpdater />

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
        onSelect={onSelect}
      />

      {showLocationMarker && <LocationMarker />}
      <FetchOnMove />
      {children}
    </MapContainer>
  );
}
