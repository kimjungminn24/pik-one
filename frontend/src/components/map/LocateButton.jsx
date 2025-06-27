import { useMap } from "react-leaflet";

export function LocateButton() {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 기능을 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 16, {
          duration: 1.5,
        });
      },
      () => {
        alert("위치 정보를 가져올 수 없습니다.");
      }
    );
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div
        className="leaflet-control locate-button"
        onClick={handleLocate}
        title="내 위치로 이동"
      >
        📍
      </div>
    </div>
  );
}
