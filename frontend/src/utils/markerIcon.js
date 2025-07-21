import L from "leaflet";
import { decorMap } from "../decorList";

export function createCustomIcon(decorName, isSelected = false) {
  const emoji = decorMap[decorName]?.emoji ?? "🌱";

  return L.divIcon({
    className: isSelected
      ? "map__emoji-marker map__emoji-marker--selected"
      : "map__emoji-marker",
    html: `<div class="map__emoji-inner">${emoji}</div>`,
    iconSize: isSelected ? [60, 60] : [50, 50],
    iconAnchor: [15, 30],
  });
}
