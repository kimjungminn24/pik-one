import { useEffect, useMemo, useState } from "react";
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

  const clusters = useMemo(
    () => index.getClusters(view.bbox, view.zoom),
    [index, view]
  );

  const activeIds = [selectedId, highlightId].filter((id) => id != null);

  return clusters.map((feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    const { cluster: isCluster, cluster_id: clusterId, point_count: count } =
      feature.properties;

    if (isCluster) {
      const leaves = index.getLeaves(clusterId, Infinity);

      const isActive =
        activeIds.length > 0 &&
        leaves.some((leaf) => activeIds.includes(leaf.properties.spot.id));

      const tally = {};
      for (const leaf of leaves) {
        const type = leaf.properties.spot.type;
        tally[type] = (tally[type] ?? 0) + 1;
      }
      const topTypes = Object.keys(tally).sort((a, b) => tally[b] - tally[a]);

      return (
        <Marker
          key={`cluster-${clusterId}`}
          position={[lat, lng]}
          icon={createClusterIcon(count, topTypes, isActive)}
          zIndexOffset={isActive ? 900 : 500}
          eventHandlers={{
            click: () => {
              const zoom = Math.min(
                index.getClusterExpansionZoom(clusterId),
                map.getMaxZoom()
              );
              map.flyTo([lat, lng], zoom, { duration: 0.6 });
            },
          }}
        />
      );
    }

    const { spot } = feature.properties;
    const state =
      spot.id === selectedId ? "selected" : spot.id === highlightId ? "hover" : "none";
    return (
      <Marker
        key={`spot-${spot.id}`}
        position={[spot.lat, spot.lng]}
        icon={createCustomIcon(spot.type, state, probabilityTone(spot))}
        zIndexOffset={state === "selected" ? 1000 : state === "hover" ? 900 : 0}
        eventHandlers={{ click: () => onSelect(spot.id) }}
      />
    );
  });
}
