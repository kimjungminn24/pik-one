import React, { useState } from "react";
import { decorList } from "../decorList";
import TagListComponent from "../components/TagListComponent";
import { useLocationStore } from "../store/useLocationStore";
import MapComponent from "../components/map/MapComponent";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDecor } from "../hooks/useDecor";

export default function Find() {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagClick = (item) => {
    setSelectedTags((prev) =>
      prev.includes(item.name)
        ? prev.filter((tag) => tag !== item.name)
        : [...prev, item.name]
    );
  };

  const { bounds } = useLocationStore();
  const debouncedBounds = useDebouncedValue(bounds, 500);

  const { data: searchResults = [] } = useDecor({
    northLat: debouncedBounds?.northLat,
    southLat: debouncedBounds?.southLat,
    eastLng: debouncedBounds?.eastLng,
    westLng: debouncedBounds?.westLng,
    types: selectedTags,
  });

  return (
    <div className="page-layout">
      <div className="map-wrapper">
        <MapComponent
          searchResults={searchResults}
          showLocationMarker={false}
        />
      </div>

      <div className="register-container">
        <TagListComponent
          items={decorList}
          isSelected={(item) => selectedTags.includes(item.name)}
          onTagClick={handleTagClick}
        />
      </div>
    </div>
  );
}
