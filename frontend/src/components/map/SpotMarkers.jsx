import { useEffect, useMemo, useRef, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import Supercluster from "supercluster";
import {
  createClusterIcon,
  createCustomIcon,
  probabilityTone,
} from "../../utils/markerIcon";

const CLUSTER_MAX_ZOOM = 15;
const CLUSTER_RADIUS = 90;

const readView = (map) => {
  const b = map.getBounds();
  return {
    bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
    zoom: Math.round(map.getZoom()),
  };
};

export default function SpotMarkers({ spots, selectedId, highlightId, onSelect }) {
  const map = useMap();
  const [view, setView] = useState(() => readView(map));

  // 부모가 다시 그려져 함수가 바뀌어도 마커 이벤트를 다시 걸지 않도록 최신 함수만 참조
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useMapEvents({
    moveend: () => setView(readView(map)),
    zoomend: () => setView(readView(map)),
  });

  useEffect(() => {
    setView(readView(map));
  }, [map]);

  const index = useMemo(() => {
    const sc = new Supercluster({ radius: CLUSTER_RADIUS, maxZoom: CLUSTER_MAX_ZOOM });
    sc.load(
      spots.map((spot) => ({
        type: "Feature",
        properties: { spot },
        geometry: { type: "Point", coordinates: [spot.lng, spot.lat] },
      }))
    );
    return sc;
  }, [spots]);

  // 묶음 구성은 지도 위치나 스팟 목록이 바뀔 때만 계산. 선택·hover 때는 아래 렌더만 다시 함
  const items = useMemo(
    () =>
      index.getClusters(view.bbox, view.zoom).map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const { cluster, cluster_id: clusterId, point_count: count, spot } = feature.properties;

        if (!cluster) {
          return {
            key: `spot-${spot.id}`,
            position: [lat, lng],
            spot,
            handlers: { click: () => onSelectRef.current(spot.id) },
          };
        }

        const leaves = index.getLeaves(clusterId, Infinity).map((leaf) => leaf.properties.spot);
        const tally = {};
        for (const leaf of leaves) tally[leaf.type] = (tally[leaf.type] ?? 0) + 1;
        return {
          key: `cluster-${clusterId}`,
          position: [lat, lng],
          count,
          leafIds: new Set(leaves.map((leaf) => leaf.id)),
          topTypes: Object.keys(tally).sort((a, b) => tally[b] - tally[a]),
          handlers: {
            click: () => {
              const zoom = Math.min(index.getClusterExpansionZoom(clusterId), map.getMaxZoom());
              map.flyTo([lat, lng], zoom, { duration: 0.6 });
            },
          },
        };
      }),
    [index, view, map]
  );

  return items.map((item) => {
    if (item.spot) {
      const { spot } = item;
      const state =
        spot.id === selectedId ? "selected" : spot.id === highlightId ? "hover" : "none";
      return (
        <Marker
          key={item.key}
          position={item.position}
          icon={createCustomIcon(spot.type, state, probabilityTone(spot))}
          zIndexOffset={state === "selected" ? 1000 : state === "hover" ? 900 : 0}
          eventHandlers={item.handlers}
        />
      );
    }

    const isActive = item.leafIds.has(selectedId) || item.leafIds.has(highlightId);
    return (
      <Marker
        key={item.key}
        position={item.position}
        icon={createClusterIcon(item.count, item.topTypes, isActive)}
        zIndexOffset={isActive ? 900 : 500}
        eventHandlers={item.handlers}
      />
    );
  });
}
