import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDecorDetail, useMyDecorsQuery, useMyFeedbacksQuery } from "../hooks/useDecor";
import { sheetCenterOffsetPx, useBottomSheet } from "../hooks/useBottomSheet";
import SpotCard from "../components/explore/SpotCard";
import SpotDetail from "../components/explore/SpotDetail";
import MyFeedbackList from "../components/MyFeedbackList";
import FlyTo from "../components/map/FlyTo";
import FitToSpots from "../components/map/FitToSpots";
import MapControls from "../components/map/MapControls";
import "../css/explore.scss";
import "../css/page.scss";
import "../css/tag.scss";

const LazyMap = React.lazy(() => import("../components/map/MapComponent"));

export default function MyPage() {
  const { t } = useTranslation();

  const { data: decors = [], isLoading: decorsLoading } = useMyDecorsQuery();
  const { data: feedbacks = [], isLoading: feedbacksLoading } = useMyFeedbacksQuery();

  const [tab, setTab] = useState("spots"); // "spots" | "feedback"
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [sheetSnap, setSheetSnap] = useState("half");
  const [flyTarget, setFlyTarget] = useState(null);

  const panelRef = useRef(null);
  const toggleSheet = () => setSheetSnap((prev) => (prev === "full" ? "half" : "full"));
  const sheetDrag = useBottomSheet(
    panelRef,
    sheetSnap,
    setSheetSnap,
    toggleSheet,
    ".explore__sheet-handle"
  );

  const { data: selected } = useDecorDetail(selectedId, !!selectedId);
  const selectedLat = selected?.lat;
  const selectedLng = selected?.lng;
  useEffect(() => {
    if (selectedLat == null || selectedLng == null) return;
    setFlyTarget({
      lat: selectedLat,
      lng: selectedLng,
      zoom: 16,
      offsetY: sheetCenterOffsetPx("half"),
      key: Date.now(),
    });
  }, [selectedLat, selectedLng]);

  const select = (id) => {
    setSelectedId(id);
    setHoveredId(null);
    setSheetSnap("half");
  };
  const back = () => {
    setSelectedId(null);
    setSheetSnap("half");
  };

  const tabs = [
    { key: "spots", label: t("mypage.title"), count: decors.length, loading: decorsLoading },
    { key: "feedback", label: t("mypage.feedback"), count: feedbacks.length, loading: feedbacksLoading },
  ];

  const renderList = () => {
    if (tab === "spots") {
      if (decorsLoading) return <p className="explore__hint">{t("common.loading")}</p>;
      if (decors.length === 0) {
        return (
          <div className="explore__empty">
            <p>{t("mypage.no_results")}</p>
            <Link to="/register" className="explore__empty-link">
              {t("mypage.go_register")}
            </Link>
          </div>
        );
      }
      return (
        <ul className="spot-list">
          {decors.map((decor) => (
            <SpotCard key={decor.id} spot={decor} onSelect={select} onHover={setHoveredId} />
          ))}
        </ul>
      );
    }
    if (feedbacksLoading) return <p className="explore__hint">{t("common.loading")}</p>;
    if (feedbacks.length === 0) {
      return <p className="explore__hint">{t("mypage.no_feedback")}</p>;
    }
    return <MyFeedbackList feedbacks={feedbacks} onSelect={select} />;
  };

  return (
    <div className={`explore explore--sheet-${sheetSnap}`}>
      <aside
        ref={panelRef}
        className={`explore__panel is-${sheetSnap}`}
        aria-label={t("menu.mypage")}
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
          <SpotDetail id={selectedId} onBack={back} onDeleted={back} />
        ) : (
          <>
            <div className="explore__chips mypage-tabs" role="tablist">
              {tabs.map(({ key, label, count, loading }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={tab === key}
                  className={`tag ${tab === key ? "tag--selected" : ""}`}
                  onClick={() => setTab(key)}
                >
                  <span className="tag__name">{label}</span>
                  {!loading && <span className="tag__count">{count}</span>}
                </button>
              ))}
            </div>
            <div className="explore__list">{renderList()}</div>
          </>
        )}
      </aside>

      <div className="explore__map">
        <Suspense fallback={<div className="explore__map-loading">{t("find.mapLoading")}</div>}>
          <LazyMap
            searchResults={decors}
            showLocationMarker={false}
            showSearchBox={false}
            zoomControlPosition={null}
            locatePosition={null}
            selectedId={selectedId}
            highlightId={selectedId ? null : hoveredId}
            onSelect={select}
          >
            <FitToSpots spots={decors} />
            <FlyTo target={flyTarget} />
            <MapControls />
          </LazyMap>
        </Suspense>
      </div>
    </div>
  );
}
