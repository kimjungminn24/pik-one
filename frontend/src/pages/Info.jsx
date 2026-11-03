import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "../css/page.scss";
import "../css/info.scss";

const CONTACTS = [
  { key: "email", value: "jmeve24@naver.com", href: "mailto:jmeve24@naver.com" },
  { key: "friendCode", value: "6335-5601-8671" },
];

export default function Info() {
  const { t } = useTranslation();

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(t("spot.copied"));
    } catch {
      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="shell info">
      <aside className="shell__panel">

        <section className="panel-section info-maker">
          <dl className="info-contacts">
            {CONTACTS.map(({ key, value, href }) => (
              <div key={key} className="info-contact">
                <dt className="info-contact__label">{t(`info.${key}`)}</dt>
                <dd className="info-contact__value">
                  <span className="info-contact__text">
                    {href ? <a href={href}>{value}</a> : value}
                  </span>
                  <button type="button" className="text-btn" onClick={() => copy(value)}>
                    {t("spot.copy")}
                  </button>
                </dd>
              </div>
            ))}
          </dl>

          <Link to="/feedback" className="btn btn--secondary btn--block">
            {t("info.go_feedback")}
          </Link>
        </section>
      </aside>

      <section className="shell__main info-visual">
        <div className="info-mascot">
          <a
            className="info-mascot__credit"
            href="https://www.instagram.com/sarii_illustration/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @sarii_illustration
          </a>
          <img
            src="/cute-200.webp"
            srcSet="/cute-200.webp 1x, /cute-320.webp 2x"
            width="320"
            height="320"
            alt=""
          />
        </div>
      </section>
    </div>
  );
}
