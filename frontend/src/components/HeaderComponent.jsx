import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../store/useUserStore";
import { useLogoutMutation } from "../hooks/useUser";
import LanguageSwitcher from "./LanguageSwitcher";
import "../css/header.scss";

const MenuIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    {open ? (
      <path d="m6 6 10 10M16 6 6 16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    ) : (
      <path d="M4 7h14M4 11h14M4 15h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    )}
  </svg>
);

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { mutate: logout } = useLogoutMutation();
  const { t } = useTranslation();
  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const links = [
    { to: "/", label: t("menu.find"), end: true },
    { to: "/register", label: t("menu.register") },
    { to: "/feedback", label: t("menu.feedback") },
    ...(isLogin ? [{ to: "/mypage", label: t("menu.mypage") }] : []),
  ];

  const renderLinks = (className) =>
    links.map(({ to, label, end }) => (
      <NavLink
        key={to}
        to={to}
        end={end}
        className={({ isActive }) => `${className} ${isActive ? "is-active" : ""}`}
      >
        {label}
      </NavLink>
    ));

  const account = (className) =>
    isLogin ? (
      <button type="button" className={`${className} header__logout`} onClick={() => logout()}>
        {t("menu.logout")}
      </button>
    ) : (
      <Link to="/login" className={`${className} header__login`}>
        {t("menu.login")}
      </Link>
    );

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          {t("title")}
        </Link>

        <nav className="header__nav" aria-label={t("menu.label")}>
          {renderLinks("header__nav-item")}
          <span className="header__divider" aria-hidden="true" />
          <LanguageSwitcher />
          {account("header__nav-item")}
        </nav>

        <button
          type="button"
          className="header__menu-button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={t(isOpen ? "menu.close" : "menu.open")}
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {isOpen && (
        <nav className="header__mobile-menu" aria-label={t("menu.label")}>
          {renderLinks("header__mobile-item")}
          {account("header__mobile-item")}
          <div className="header__mobile-lang">
            <LanguageSwitcher inline />
          </div>
          <Link to="/privacy" className="header__mobile-privacy">
            {t("footer.privacy")}
          </Link>
        </nav>
      )}
    </header>
  );
}
