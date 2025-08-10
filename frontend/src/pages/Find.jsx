import React, { Suspense, useState } from "react";
import { decorList } from "../decorList";
import TagListComponent from "../components/TagListComponent";
import { useLocationStore } from "../store/useLocationStore";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDecor } from "../hooks/useDecor";
import LoadingSpinner from "../components/LoadingSpinner";
import "../css/find.scss";

const LazyMap = React.lazy(() => import("../components/map/MapComponent"));
export default function Find() {
  const [selectedTags, setSelectedTags] = useState([]);

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
    ko: "전체",
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
        <Suspense fallback={<div>지도를 불러오는 중...</div>}>
          <LazyMap searchResults={searchResults} showLocationMarker={false} />
        </Suspense>
        {isLoading && (
          <div className="map-loading-overlay">
            <LoadingSpinner message="🌱 단독 스팟을 불러오는 중이에요..." />
          </div>
        )}
        {selectedTags.length > 0 && (
          <div className="search-result-banner">
            {searchResults.length > 0 ? (
              <span className="search-result-count">
                <span className="highlight-number">{searchResults.length}</span>
                개가 검색되었어요!
              </span>
            ) : (
              <span className="search-result-count no-result">
                검색된 단독 스팟이 없어요
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
