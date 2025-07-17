import L from "leaflet";
import { decorList } from "../decorList";

export function createCustomIcon(decorName, isSelected = false) {
  const found = decorList.find((item) => item.name === decorName);
  const emoji = found?.emoji ?? "🌱";

  return L.divIcon({
    className: isSelected
      ? "map__emoji-marker map__emoji-marker--selected"
      : "map__emoji-marker",
    html: `<div class="map__emoji-inner">${emoji}</div>`,
    iconSize: isSelected ? [60, 60] : [50, 50],
    iconAnchor: [15, 30],
  });
}
