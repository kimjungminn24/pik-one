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
// 위아래로는 지도 끝 밖으로 못 나가게. 옆으로는 지구가 이어지니 막지 않음
const WORLD_BOUNDS = [
  [-85, -540],
  [85, 540],
];

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
      maxBounds={WORLD_BOUNDS}
      maxBoundsViscosity={1}
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
        updateWhenIdle={false}
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
