import { useMap } from "react-leaflet";
import { useState } from "react";
import { searchLocation } from "../../api/geocode";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
export function SearchBox() {
  const map = useMap();
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const handleSearch = async () => {
    const results = await searchLocation(query);
    if (results.length > 0) {
      const { lat, lon } = results[0];
      map.setView([parseFloat(lat), parseFloat(lon)], 16);
    } else {
      toast.info(t("toast.search_info"));
    }
  };

  return (
    <div className="map__search-box">
      <input
        className="map__search-box-input"
        type="text"
        placeholder="장소를 검색하세요"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="map__search-box-button" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
}
