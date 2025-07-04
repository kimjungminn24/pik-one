export default function DecorInfoSection({
  type,
  lat,
  lng,
  probability,
  content,
}) {
  return (
    <div className="decor-info">
      <div className="decor-header">
        <strong className="decor-type">{type}</strong>
        <span className="decor-probability">
          🌱 존재 확률 {probability === null ? "-" : `${probability}%`}
        </span>
      </div>

      <p className="decor-content">{content} </p>

      <div className="decor-coordinates">
        <p>📍 위도: {lat}</p>
        <p>📍 경도: {lng}</p>
      </div>
    </div>
  );
}
