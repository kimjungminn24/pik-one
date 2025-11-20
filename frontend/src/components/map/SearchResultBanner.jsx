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
    if (isZoomTooLow) return "지도를 더 확대해야 검색할 수 있어요.";
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
