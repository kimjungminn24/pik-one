export default function DecorInfoSection({ type, lat, lng, probability }) {
  return (
    <div className="decor-info">
      <div className="decor-header">
        <strong className="decor-type">{type}</strong>
        <span className="decor-probability">
          🌱 존재 확률 {probability === null ? "-" : `${probability}%`}
        </span>
      </div>

      <p className="decor-content">{type} 관련 위치</p>

      <div className="decor-coordinates">
        <p>📍 위도: {lat}</p>
        <p>📍 경도: {lng}</p>
      </div>
    </div>
  );
}
