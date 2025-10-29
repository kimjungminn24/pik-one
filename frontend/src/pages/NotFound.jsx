import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <h1 className="emoji">404 페이지를 찾을 수 없습니다 😢</h1>
      <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default NotFound;
