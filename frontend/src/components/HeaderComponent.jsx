import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useLogoutMutation } from "../hooks/useUser";
import "../css/header.scss";

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
      <div className="header__container">
        <div className="header__logo">
          <Link to="/">단독스팟</Link>
        </div>

        <nav className="header__nav">
          <Link to="/register" className="header__nav-item">
            모종 등록
          </Link>
          <Link to="/find" className="header__nav-item">
            모종 찾기
          </Link>
          {isLogin ? (
            <>
              <Link to="/mypage" className="header__nav-item">
                내 정보
              </Link>

              <button
                onClick={() => logout()}
                className="header__nav-item header__logout-button"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="header__login-wrapper">
              <img
                src="/btn.png"
                alt="로그인버튼"
                className="header__login-button"
              />
            </button>
          )}
        </nav>

        <div className="header__menu-icon" onClick={toggleMenu}>
          {isOpen ? "✖" : "☰"}
        </div>
      </div>

      <div className={`header__mobile-menu ${isOpen ? "show" : ""}`}>
        <Link
          to="/register"
          className="header__mobile-item"
          onClick={toggleMenu}
        >
          모종 등록
        </Link>
        <Link to="/find" className="header__mobile-item" onClick={toggleMenu}>
          모종 찾기
        </Link>

        {isLogin ? (
          <>
            <Link to="/mypage" className="header__mobile-item">
              내 정보
            </Link>

            <button
              onClick={() => logout()}
              className="header__logout-button header__mobile-item"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="header__login-wrapper">
            <img
              src="/btn.png"
              alt="로그인버튼"
              className="header__login-button"
            />
          </button>
        )}
      </div>
    </header>
  );
}
