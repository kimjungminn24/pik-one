import L from "leaflet";
import { decorMap } from "../decorList";

const PIN_W = 46;
const PIN_H = 62;

const SPROUT = { none: "🌱", good: "🌸", low: "🍂" };

const iconCache = new Map();

export function probabilityTone(spot) {
  const helpful = spot?.helpfulCount ?? 0;
  const notFound = spot?.notFoundCount ?? 0;
  const total = helpful + notFound;
  if (total === 0) return "none";
  return helpful / total >= 0.7 ? "good" : "low";
}

const cached = (key, build) => {
  if (!iconCache.has(key)) iconCache.set(key, build());
  return iconCache.get(key);
};

export function createCustomIcon(decorName, state = "none", tone = "none") {
  if (state === true) state = "selected";
  if (state === false) state = "none";

  return cached(`pin|${decorName}|${state}|${tone}`, () => {
    const isPick = decorName === "DEFAULT";
    const inner = isPick
      ? `<span class="spot-pin__pick"></span>`
      : decorMap[decorName]?.emoji ?? "🌱";
    const sprout = isPick
      ? ""
      : `<span class="spot-pin__sprout emoji">${SPROUT[tone] ?? SPROUT.none}</span>`;
    const classes = [
      "spot-pin",
      `spot-pin--${tone}`,
      isPick ? "spot-pin--pick" : "",
      state !== "none" ? `spot-pin--${state}` : "",
    ].join(" ");

    return L.divIcon({
      className: "spot-pin-icon",
      html: `<div class="${classes}">${sprout}<div class="spot-pin__bubble emoji">${inner}</div><div class="spot-pin__tail"></div></div>`,
      iconSize: [PIN_W, PIN_H],
      iconAnchor: [PIN_W / 2, PIN_H],
    });
  });
}

export function createClusterIcon(count, types = [], isActive = false) {
  const label = count > 999 ? "999+" : String(count);
  const single = types.length === 1 ? types[0] : null;
  const size = count >= 50 ? "lg" : count >= 10 ? "md" : "sm";

  return cached(`cluster|${label}|${single ?? "mixed"}|${size}|${isActive}`, () => {
    const classes = [
      "spot-cluster",
      single ? "spot-cluster--single" : `spot-cluster--mixed spot-cluster--${size}`,
      isActive ? "spot-cluster--active" : "",
    ].join(" ");
    const emoji = single
      ? `<span class="spot-cluster__emoji emoji">${decorMap[single]?.emoji ?? "🌱"}</span>`
      : "";
    return L.divIcon({
      className: "spot-cluster-icon",
      html: `<div class="${classes}">${emoji}<span class="spot-cluster__count">${label}</span></div>`,
      iconSize: null,
      iconAnchor: null,
    });
  });
}
