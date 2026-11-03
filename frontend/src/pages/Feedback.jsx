import { useTranslation } from "react-i18next";
import ReportComponent from "../components/report/ReportComponent";
import "../css/page.scss";
import "../css/report.scss";

const COMMUNITIES = [
  {
    region: "korea",
    links: [{ key: "pikmin_cafe", url: "https://cafe.naver.com/pikmins" }],
  },
  { region: "taiwan", links: [] },
  { region: "japan", links: [] },
  { region: "usa", links: [] },
];

const ExternalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5.5 3H3.5A1 1 0 0 0 2.5 4v6.5a1 1 0 0 0 1 1H10a1 1 0 0 0 1-1v-2M8 2.5h3.5V6M11.5 2.5 6.5 7.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Feedback() {
  const { t } = useTranslation();

  return (
    <ReportComponent
      enabled
      outro={
        <section className="panel-section community">
          <h2 className="panel-section__title">{t("community.title")}</h2>
          <ul className="community__list">
            {COMMUNITIES.map(({ region, links }) => (
              <li key={region} className="community__row">
                <span className="community__label">
                  {t(`community.${region}`)}
                </span>
                {links.length > 0 ? (
                  links.map(({ key, url }) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="community__link"
                    >
                      {t(`community.${key}`)}
                      <ExternalIcon />
                    </a>
                  ))
                ) : (
                  <span className="community__empty">
                    {t("community.need_info")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      }
    />
  );
}
