import React from "react";
import "../css/footer.scss";
import { useTranslation } from "react-i18next";
export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <p>{t("footer.copyright")}</p>
      <p>
        Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap contributors
        </a>{" "}
        | Icons ©{" "}
        <a
          href="https://toss.im/tossface"
          target="_blank"
          rel="noopener noreferrer"
        >
          TossFace
        </a>
      </p>
    </footer>
  );
}
