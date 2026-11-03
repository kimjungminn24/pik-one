import MapComponent from "../map/MapComponent";
import FlyTo from "../map/FlyTo";
import MapControls from "../map/MapControls";

// 메인 화면 지도. Leaflet을 쓰는 부분을 한 파일에 모아 지연 로딩한다 (메인 번들에서 Leaflet 분리)
export default function ExploreMap({ spots, selectedId, highlightId, onSelect, flyTarget }) {
  return (
    <MapComponent
      searchResults={spots}
      showLocationMarker={false}
      showSearchBox={false}
      zoomControlPosition={null}
      locatePosition={null}
      selectedId={selectedId}
      highlightId={highlightId}
      onSelect={onSelect}
    >
      <FlyTo target={flyTarget} />
      <MapControls />
    </MapComponent>
  );
}
