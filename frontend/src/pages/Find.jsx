import React, { Suspense, useState } from "react";
import { decorList } from "../decorList";
import TagListComponent from "../components/TagListComponent";
import { useLocationStore } from "../store/useLocationStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDecor } from "../hooks/useDecor";
import LoadingSpinner from "../components/LoadingSpinner";
import "../css/find.scss";
import { useTranslation } from "react-i18next";

const LazyMap = React.lazy(() => import("../components/map/MapComponent"));
export default function Find() {
  const [selectedTags, setSelectedTags] = useState([]);
  const { t } = useTranslation();
  const handleTagClick = (item) => {
    if (item.name === "ALL") {
      const allTagNames = decorList.map((d) => d.name);
      const isAllSelected = allTagNames.every((name) =>
        selectedTags.includes(name)
      );

      setSelectedTags(isAllSelected ? [] : allTagNames);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(item.name)
        ? prev.filter((tag) => tag !== item.name)
        : [...prev, item.name]
    );
  };

  const { bounds } = useLocationStore();
  const debouncedBounds = useDebouncedValue(bounds, 500);

  const isAllMode =
    selectedTags.length === decorList.length &&
    decorList.every((d) => selectedTags.includes(d.name));

  const { data: searchResults = [], isLoading } = useDecor({
    northLat: debouncedBounds?.northLat,
    southLat: debouncedBounds?.southLat,
    eastLng: debouncedBounds?.eastLng,
    westLng: debouncedBounds?.westLng,
    types: selectedTags,
    isAllMode,
  });

  const allTag = {
    name: "ALL",
    ko: t("find.all"),
    tags: [],
    emoji: "🌐",
  };

  const isTagSelected = (item, selectedTags, decorList) => {
    if (item.name === "ALL") {
      const allTagNames = decorList.map((d) => d.name);
      return allTagNames.every((name) => selectedTags.includes(name));
    }
    return selectedTags.includes(item.name);
  };

  return (
    <div className="page-layout">
      <div className="page-section">
        <Suspense fallback={<div>{t("find.mapLoading")}</div>}>
          <LazyMap searchResults={searchResults} showLocationMarker={false} />
        </Suspense>
        {isLoading && (
          <div className="map-loading-overlay">
            <LoadingSpinner message={t("find.loadingMessage")} />
          </div>
        )}
        {selectedTags.length > 0 && (
          <div className="search-result-banner">
            {searchResults.length > 0 ? (
              <span className="search-result-count">
                {t("find.resultCount", { count: searchResults.length })}
              </span>
            ) : (
              <span className="search-result-count no-result">
                {t("find.noResult")}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="page-section">
        <TagListComponent
          items={[allTag, ...decorList]}
          isSelected={(item) => isTagSelected(item, selectedTags, decorList)}
          onTagClick={handleTagClick}
        />
      </div>
    </div>
  );
}
