import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MascotPanel from "../components/MascotPanel";
import "../css/page.scss";

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="shell">
      <aside className="shell__panel">
        <h1 className="shell__title">{t("notfound.title")}</h1>
        <section className="panel-section">
          <Link to="/" className="btn btn--primary btn--block">
            {t("notfound.home")}
          </Link>
        </section>
      </aside>

      <MascotPanel />
    </div>
  );
}

export default NotFound;
