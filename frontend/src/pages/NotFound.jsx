import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <h1 className="emoji">{t("notfound.title")}</h1>
      <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
        {t("notfound.home")}
      </Link>
    </div>
  );
}

export default NotFound;
