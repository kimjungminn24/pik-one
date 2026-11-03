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
// 지도 끝 밖으로 못 나가게. 옆으로도 막아서 같은 세계가 반복되지 않게 (반복된 쪽에는 핀이 안 보임)
const WORLD_BOUNDS = [
  [-85, -180],
  [85, 180],
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
        noWrap
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
