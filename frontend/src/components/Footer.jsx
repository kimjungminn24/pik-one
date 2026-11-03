import React from "react";
import "../css/footer.scss";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CREDITS = [
  { label: "Map data ©", name: "OpenStreetMap", href: "https://www.openstreetmap.org/copyright" },
  { label: "Icons ©", name: "TossFace", href: "https://toss.im/tossface" },
];

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <p className="footer__copyright">
        {t("footer.copyright")}
        <Link to="/privacy" className="footer__privacy">
          {t("footer.privacy")}
        </Link>
      </p>
      <ul className="footer__credits">
        {CREDITS.map(({ label, name, href }) => (
          <li key={name}>
            {label}{" "}
            <a href={href} target="_blank" rel="noopener noreferrer">
              {name}
            </a>
          </li>
        ))}
        <li>
          Made by <Link to="/info">Jung Min</Link>
        </li>
      </ul>
    </footer>
  );
}
