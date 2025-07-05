import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { isLogin } = useUserStore();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/oauth2/authorization/naver`;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link to="/">픽픽</Link>
        </div>

        <nav className="nav">
          <Link to="/register">모종 등록</Link>
          <Link to="/find">모종 찾기</Link>
          {isLogin ? (
            <Link to="/mypage"> 내 정보</Link>
          ) : (
            <button onClick={handleLogin}>네이버 로그인</button>
          )}
        </nav>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? "✖" : "☰"}
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
        <Link to="/register" onClick={toggleMenu}>
          모종 등록
        </Link>
        <Link to="/find" onClick={toggleMenu}>
          모종 찾기
        </Link>

        {isLogin ? (
          <Link to="/mypage" onClick={toggleMenu}>
            내 정보
          </Link>
        ) : (
          <button onClick={handleLogin}>네이버 로그인</button>
        )}
      </div>
    </header>
  );
}
