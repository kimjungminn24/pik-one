import { useMap } from "react-leaflet";
import { useState } from "react";
import { searchLocation } from "../../api/geocode";
import { toast } from "react-toastify";
export function SearchBox() {
  const map = useMap();
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    const results = await searchLocation(query);
    if (results.length > 0) {
      const { lat, lon } = results[0];
      map.setView([parseFloat(lat), parseFloat(lon)], 16);
    } else {
      toast.info("검색 결과가 없습니다.");
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
