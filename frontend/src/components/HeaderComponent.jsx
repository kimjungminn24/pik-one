import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useLogoutMutation } from "../hooks/useUser";
import "../css/header.scss";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { mutate: logout } = useLogoutMutation();
  const { t } = useTranslation();

  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link to="/">{t("title")}</Link>
        </div>

        <nav className="header__nav">
          <Link to="/register" className="header__nav-item">
            {t("menu.register")}
          </Link>
          <Link to="/find" className="header__nav-item">
            {t("menu.find")}
          </Link>
          {isLogin ? (
            <>
              <Link to="/mypage" className="header__nav-item">
                {t("menu.mypage")}
              </Link>

              <button
                onClick={() => logout()}
                className="header__nav-item header__logout-button"
              >
                {t("menu.logout")}
              </button>
            </>
          ) : (
            <Link to="/login" className="header__nav-item">
              {t("menu.login")}
            </Link>
          )}
          <div className="header__lang-switcher">
            <LanguageSwitcher />
          </div>
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
          {t("menu.register")}
        </Link>
        <Link to="/find" className="header__mobile-item" onClick={toggleMenu}>
          {t("menu.find")}
        </Link>

        {isLogin ? (
          <>
            <Link to="/mypage" className="header__mobile-item">
              {t("menu.mypage")}
            </Link>

            <button
              onClick={() => logout()}
              className="header__logout-button header__mobile-item"
            >
              {t("menu.logout")}
            </button>
          </>
        ) : (
          <Link to="/login" className="header__mobile-item">
            {t("menu.login")}
          </Link>
        )}
        <div className="header__lang-switcher">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
