export default function DecorInfoSection({
  type,
  lat,
  lng,
  probability,
  content,
}) {
  return (
    <div className="decor-info">
      <div className="decor-info__header">
        <strong className="decor-info__type">{type}</strong>
        <span className="decor-info__probability">
          🌱 존재 확률 {probability === null ? "-" : `${probability}%`}
        </span>
      </div>

      <p className="decor-info__content">{content} </p>

      <div className="decor-info__coordinates">
        <p>📍 위도: {lat}</p>
        <p>📍 경도: {lng}</p>
      </div>
    </div>
  );
}
