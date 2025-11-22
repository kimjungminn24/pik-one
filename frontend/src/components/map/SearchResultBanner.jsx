export default function SearchResultBanner({
  selectedTags,
  searchResults,
  zoom,
  minZoom,
  t,
}) {
  if (selectedTags.length === 0) return null;

  const isZoomTooLow = zoom < minZoom;
  const isEmpty = searchResults.length === 0;

  const getMessage = () => {
    if (isZoomTooLow) return t("find.zoomInMore");
    if (isEmpty) return t("find.noResult");
    return t("find.resultCount", { count: searchResults.length });
  };

  const getClassName = () =>
    `search-result-count${isZoomTooLow || isEmpty ? " no-result" : ""}`;

  return (
    <div className="search-result-banner">
      <span className={getClassName()}>{getMessage()}</span>
    </div>
  );
}
