import L from "leaflet";

export const customIcon = L.divIcon({
  className: "emoji-marker",
  html: "🌱",
  iconSize: [50, 50],
  iconAnchor: [15, 30],
});
