import { useTranslation } from "react-i18next";

// 나라 가운데와 나라가 한 화면에 들어오는 줌
export const COUNTRIES = [
  { code: "KR", flag: "🇰🇷", lat: 36.3, lng: 127.8, zoom: 7 },
  { code: "JP", flag: "🇯🇵", lat: 36.2, lng: 138.3, zoom: 5 },
  { code: "TW", flag: "🇹🇼", lat: 23.7, lng: 121.0, zoom: 7 },
  { code: "HK", flag: "🇭🇰", lat: 22.35, lng: 114.15, zoom: 11 },
  { code: "SG", flag: "🇸🇬", lat: 1.35, lng: 103.82, zoom: 11 },
  { code: "TH", flag: "🇹🇭", lat: 15.5, lng: 101.0, zoom: 5 },
  { code: "US", flag: "🇺🇸", lat: 39.5, lng: -98.4, zoom: 4 },
  { code: "CA", flag: "🇨🇦", lat: 56.0, lng: -96.0, zoom: 3 },
  { code: "GB", flag: "🇬🇧", lat: 54.0, lng: -2.5, zoom: 5 },
  { code: "FR", flag: "🇫🇷", lat: 46.6, lng: 2.4, zoom: 5 },
  { code: "DE", flag: "🇩🇪", lat: 51.2, lng: 10.4, zoom: 6 },
  { code: "ES", flag: "🇪🇸", lat: 40.2, lng: -3.6, zoom: 6 },
  { code: "IT", flag: "🇮🇹", lat: 42.8, lng: 12.5, zoom: 5 },
  { code: "AU", flag: "🇦🇺", lat: -25.7, lng: 134.5, zoom: 4 },
];

export default function CountryJump({ onPick, className = "" }) {
  const { t } = useTranslation();

  return (
    <nav className={`country-jump ${className}`} aria-label={t("country.label")}>
      {COUNTRIES.map((country) => (
        <button
          key={country.code}
          type="button"
          className="country-jump__btn"
          onClick={() => onPick(country)}
          title={t(`country.${country.code}`)}
          aria-label={t(`country.${country.code}`)}
        >
          <span className="emoji" aria-hidden="true">{country.flag}</span>
        </button>
      ))}
    </nav>
  );
}
