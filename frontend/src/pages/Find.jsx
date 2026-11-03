import React, { Suspense, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { decorList } from "../decorList";
import Tag from "../components/TagComponent";
import PlaceSearch from "../components/explore/PlaceSearch";
import SpotCard from "../components/explore/SpotCard";
import SpotDetail from "../components/explore/SpotDetail";
import FlyTo from "../components/map/FlyTo";
import MapControls from "../components/map/MapControls";
import { useLocationStore } from "../store/useLocationStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDecor } from "../hooks/useDecor";
import { sheetCenterOffsetPx, useBottomSheet } from "../hooks/useBottomSheet";
import "../css/explore.scss";

const LazyMap = React.lazy(() => import("../components/map/MapComponent"));

const MIN_ZOOM = 10;
const PRIMARY_LIMIT = 5;
const DECOR_ORDER = Object.fromEntries(decorList.map((d, i) => [d.name, i]));

const distanceMeters = (a, b) => {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export default function Find() {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [sheetSnap, setSheetSnap] = useState("half");
  const [flyTarget, setFlyTarget] = useState(null);

  const panelRef = useRef(null);
  const toggleSheet = () =>
    setSheetSnap((prev) => (prev === "full" ? "half" : "full"));
  const sheetDrag = useBottomSheet(
    panelRef,
    sheetSnap,
    setSheetSnap,
    toggleSheet,
    ".explore__sheet-handle"
  );

  const { bounds, zoom } = useLocationStore();
  const debouncedBounds = useDebouncedValue(bounds, 500);

  const isAllMode = selectedTags.length === 0;
  const canSearch = zoom >= MIN_ZOOM;

  const { data: spotsInView = [], isLoading } = useDecor(
    {
      northLat: debouncedBounds?.northLat,
      southLat: debouncedBounds?.southLat,
      eastLng: debouncedBounds?.eastLng,
      westLng: debouncedBounds?.westLng,
      isAllMode: true,
    },
    canSearch
  );

  const center = useMemo(
    () => ({
      lat: (Number(bounds.northLat) + Number(bounds.southLat)) / 2,
      lng: (Number(bounds.eastLng) + Number(bounds.westLng)) / 2,
    }),
    [bounds]
  );

  const countByType = useMemo(() => {
    const counts = {};
    for (const spot of spotsInView) {
      counts[spot.type] = (counts[spot.type] ?? 0) + 1;
    }
    return counts;
  }, [spotsInView]);

  const { primaryTags, otherTags } = useMemo(() => {
    const byCount = (a, b) =>
      (countByType[b.name] ?? 0) - (countByType[a.name] ?? 0) ||
      DECOR_ORDER[a.name] - DECOR_ORDER[b.name];

    const selected = decorList.filter((d) => selectedTags.includes(d.name)).sort(byCount);
    const present = decorList
      .filter((d) => countByType[d.name] > 0 && !selectedTags.includes(d.name))
      .sort(byCount);
    const room = Math.max(0, PRIMARY_LIMIT - selected.length);
    const primary = [...selected, ...present.slice(0, room)];
    const primaryNames = new Set(primary.map((d) => d.name));

    return {
      primaryTags: primary,
      otherTags: [
        ...present.slice(room),
        ...decorList.filter((d) => !primaryNames.has(d.name) && !countByType[d.name]),
      ],
    };
  }, [countByType, selectedTags]);

  const [showOtherTags, setShowOtherTags] = useState(false);

  const visibleSpots = useMemo(() => {
    const filtered = isAllMode
      ? spotsInView
      : spotsInView.filter((spot) => selectedTags.includes(spot.type));
    return filtered
      .map((spot) => ({ spot, distance: distanceMeters(center, spot) }))
      .sort((a, b) => a.distance - b.distance);
  }, [isAllMode, spotsInView, selectedTags, center]);

  const handleTagClick = (item) => {
    if (item.name === "ALL") {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(item.name)
        ? prev.filter((tag) => tag !== item.name)
        : [...prev, item.name]
    );
  };

  const selectSpot = (id) => {
    setSelectedId(id);
    setHoveredId(null);
    setSheetSnap("half");
    const spot = spotsInView.find((s) => s.id === id);
    if (spot) {
      setFlyTarget({
        lat: spot.lat,
        lng: spot.lng,
        offsetY: sheetCenterOffsetPx("half"),
        key: Date.now(),
      });
    }
  };

  const moveTo = ({ lat, lng }) => {
    setSelectedId(null);
    setFlyTarget({ lat, lng, zoom: 16, key: Date.now() });
  };

  const allTag = { name: "ALL", ko: t("find.all"), emoji: "🌐" };

  const renderList = () => {
    if (!canSearch) {
      return <p className="explore__hint">{t("explore.zoom_in")}</p>;
    }
    if (isLoading && spotsInView.length === 0) {
      return <p className="explore__hint">{t("common.loading")}</p>;
    }
    if (visibleSpots.length === 0) {
      return (
        <div className="explore__empty">
          <p>
            {isAllMode || spotsInView.length === 0
              ? t("explore.empty")
              : t("explore.empty_filtered")}
          </p>
          <Link to="/register" className="explore__empty-link">
            {t("explore.empty_register")}
          </Link>
        </div>
      );
    }
    return (
      <ul className="spot-list">
        {visibleSpots.map(({ spot, distance }) => (
          <SpotCard
            key={spot.id}
            spot={spot}
            distance={distance}
            onSelect={selectSpot}
            onHover={setHoveredId}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className={`explore explore--sheet-${sheetSnap}`}>
      <PlaceSearch className="explore__search" onFound={moveTo} />

      <aside
        ref={panelRef}
        className={`explore__panel is-${sheetSnap}`}
        aria-label={t("explore.panel_label")}
        {...sheetDrag}
      >
        <button
          type="button"
          className="explore__sheet-handle"
          onClick={(e) => e.detail === 0 && toggleSheet()}
          aria-expanded={sheetSnap === "full"}
          aria-label={t(sheetSnap === "full" ? "explore.collapse" : "explore.expand")}
        />
        {selectedId ? (
          <SpotDetail
            id={selectedId}
            onBack={() => {
              setSelectedId(null);
              setSheetSnap("half");
            }}
            onDeleted={() => {
              setSelectedId(null);
              setSheetSnap("half");
            }}
          />
        ) : (
          <>
            <div
              className={`explore__chips ${showOtherTags ? "is-expanded" : ""}`}
            >
              <Tag
                item={allTag}
                isSelected={isAllMode}
                count={canSearch ? spotsInView.length : undefined}
                onClick={handleTagClick}
              />
              {primaryTags.map((item) => (
                <Tag
                  key={item.name}
                  item={item}
                  isSelected={selectedTags.includes(item.name)}
                  count={canSearch ? countByType[item.name] ?? 0 : undefined}
                  onClick={handleTagClick}
                />
              ))}
              {showOtherTags &&
                otherTags.map((item) => (
                  <Tag
                    key={item.name}
                    item={item}
                    isSelected={selectedTags.includes(item.name)}
                    count={canSearch && countByType[item.name] ? countByType[item.name] : undefined}
                    muted={!countByType[item.name]}
                    onClick={handleTagClick}
                  />
                ))}
              {otherTags.length > 0 && (
                <button
                  type="button"
                  className="tag tag--more"
                  aria-expanded={showOtherTags}
                  onClick={() => setShowOtherTags((prev) => !prev)}
                >
                  {showOtherTags
                    ? t("explore.less_tags")
                    : t("explore.more_tags", { count: otherTags.length })}
                </button>
              )}
            </div>

            <div className="explore__list">{renderList()}</div>
          </>
        )}
      </aside>

      <div className="explore__map">
        <Suspense fallback={<div className="explore__map-loading">{t("find.mapLoading")}</div>}>
          <LazyMap
            searchResults={visibleSpots.map((v) => v.spot)}
            showLocationMarker={false}
            showSearchBox={false}
            zoomControlPosition={null}
            locatePosition={null}
            selectedId={selectedId}
            highlightId={selectedId ? null : hoveredId}
            onSelect={selectSpot}
          >
            <FlyTo target={flyTarget} />
            <MapControls />
          </LazyMap>
        </Suspense>
      </div>
    </div>
  );
}
