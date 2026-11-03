import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { searchLocation } from "../../api/geocode";

export default function PlaceSearch({ onFound, className = "" }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || isSearching) return;

    setIsSearching(true);
    try {
      const results = await searchLocation(q);
      if (results.length === 0) {
        toast.info(t("toast.search_info"));
        return;
      }
      const { lat, lon } = results[0];
      onFound({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form className={`place-search ${className}`} onSubmit={handleSubmit} role="search">
      <svg
        className="place-search__icon"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12.2 12.2 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        className="place-search__input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("explore.search_placeholder")}
        aria-label={t("explore.search_placeholder")}
        enterKeyHint="search"
      />
      {query && (
        <button
          type="button"
          className="place-search__clear"
          onClick={() => setQuery("")}
          aria-label={t("explore.search_clear")}
        >
          ✕
        </button>
      )}
    </form>
  );
}
