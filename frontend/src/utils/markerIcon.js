import L from "leaflet";
import { decorList } from "../decorList";

export function createCustomIcon(decorName, isSelected = false) {
  const found = decorList.find((item) => item.name === decorName);
  const emoji = found?.emoji ?? "🌱";
  return L.divIcon({
    className: isSelected ? "emoji-marker selected" : "emoji-marker",
    html: `<div class="emoji-inner">${emoji}</div>`,
    iconSize: isSelected ? [60, 60] : [50, 50],
    iconAnchor: [15, 30],
  });
}
