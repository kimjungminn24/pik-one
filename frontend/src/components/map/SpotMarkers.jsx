import { useEffect, useMemo, useRef, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import Supercluster from "supercluster";
import {
  createClusterIcon,
  createCustomIcon,
  probabilityTone,
} from "../../utils/markerIcon";

const CLUSTER_MAX_ZOOM = 15;
const CLUSTER_RADIUS = 90;

// 키보드로 핀·묶음에 초점을 두고 Enter나 Space를 누르면 클릭과 같게
const withKeyboard = (onActivate) => ({
  click: onActivate,
  keydown: (e) => {
    const key = e.originalEvent.key;
    if (key === "Enter" || key === " ") {
      e.originalEvent.preventDefault();
      onActivate();
    }
  },
});

const readView = (map) => {
  const b = map.getBounds();
  return {
    bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
    zoom: Math.round(map.getZoom()),
  };
};

export default function SpotMarkers({ spots, selectedId, highlightId, onSelect }) {
  const map = useMap();
  const { t, i18n } = useTranslation();
  // react-leaflet은 title을 마커를 만들 때만 넣으므로, 언어가 바뀌면 마커를 새로 만든다
  const lang = i18n.resolvedLanguage;
  const [view, setView] = useState(() => readView(map));

  // 키보드·스크린리더용 핀 이름 ("카페, 존재 확률 67% · 3명 확인")
  const spotTitle = (spot) => {
    const total = (spot.helpfulCount ?? 0) + (spot.notFoundCount ?? 0);
    const status =
      total === 0
        ? t("explore.no_feedback")
        : t("explore.probability", { value: Math.round((spot.helpfulCount / total) * 100), count: total });
    return `${t(`decor.${spot.type}`)}, ${status}`;
  };

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
            handlers: withKeyboard(() => onSelectRef.current(spot.id)),
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
          handlers: withKeyboard(() => {
            const zoom = Math.min(index.getClusterExpansionZoom(clusterId), map.getMaxZoom());
            map.flyTo([lat, lng], zoom, { duration: 0.6 });
          }),
        };
      }),
    [index, view, map]
  );

  // 묶음이 보이는 줌에서는 혼자 있는 스팟도 "1" 묶음으로 보여 줘서 모양을 맞춤
  const singleAsCluster = view.zoom <= CLUSTER_MAX_ZOOM;

  return items.map((item) => {
    if (item.spot && singleAsCluster) {
      const { spot } = item;
      const isActive = spot.id === selectedId || spot.id === highlightId;
      return (
        <Marker
          key={`${item.key}-single-${lang}`}
          position={item.position}
          icon={createClusterIcon(1, [spot.type], isActive)}
          title={spotTitle(spot)}
          zIndexOffset={isActive ? 900 : 500}
          eventHandlers={item.handlers}
        />
      );
    }

    if (item.spot) {
      const { spot } = item;
      const state =
        spot.id === selectedId ? "selected" : spot.id === highlightId ? "hover" : "none";
      return (
        <Marker
          key={`${item.key}-${lang}`}
          position={item.position}
          icon={createCustomIcon(spot.type, state, probabilityTone(spot))}
          title={spotTitle(spot)}
          zIndexOffset={state === "selected" ? 1000 : state === "hover" ? 900 : 0}
          eventHandlers={item.handlers}
        />
      );
    }

    const isActive = item.leafIds.has(selectedId) || item.leafIds.has(highlightId);
    return (
      <Marker
        key={`${item.key}-${lang}`}
        position={item.position}
        icon={createClusterIcon(item.count, item.topTypes, isActive)}
        title={t("map.cluster_title", { count: item.count })}
        zIndexOffset={isActive ? 900 : 500}
        eventHandlers={item.handlers}
      />
    );
  });
}
