import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useLogoutMutation } from "../hooks/useUser";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { mutate: logout } = useLogoutMutation();

  const isLogin = useUserStore((state) => state.isLogin);

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
          <Link to="/">단독스팟</Link>
        </div>

        <nav className="nav">
          <Link to="/register" className="nav-item">
            모종 등록
          </Link>
          <Link to="/find" className="nav-item">
            모종 찾기
          </Link>
          {isLogin ? (
            <>
              <Link to="/mypage" className="nav-item">
                내 정보
              </Link>

              <button
                onClick={() => logout()}
                className="nav-item logout-button"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="login-button-wrapper">
              <img src="/btn.png" alt="로그인버튼" className="login-button" />
            </button>
          )}
        </nav>

        <div className="menu-icon " onClick={toggleMenu}>
          {isOpen ? "✖" : "☰"}
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
        <Link to="/register" className="mobile-item" onClick={toggleMenu}>
          모종 등록
        </Link>
        <Link to="/find" className="mobile-item" onClick={toggleMenu}>
          모종 찾기
        </Link>

        {isLogin ? (
          <>
            <Link to="/mypage" className="mobile-item">
              내 정보
            </Link>

            <button
              onClick={() => logout()}
              className="logout-button mobile-item"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="login-button-wrapper">
            <img src="/btn.png" alt="로그인버튼" className="login-button" />
          </button>
        )}
      </div>
    </header>
  );
}
