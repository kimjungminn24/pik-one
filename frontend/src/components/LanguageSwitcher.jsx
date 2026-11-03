import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
];

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M1.75 8h12.5M8 1.75c1.7 1.8 2.5 3.9 2.5 6.25S9.7 12.45 8 14.25C6.3 12.45 5.5 10.35 5.5 8S6.3 3.55 8 1.75Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LanguageSwitcher({ inline = false }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = (i18n.resolvedLanguage || i18n.language || "ko").slice(0, 2);

  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("i18nextLng", code);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (inline) {
    return (
      <div className="lang-inline" role="group" aria-label={t("menu.language")}>
        <GlobeIcon />
        {LANGUAGES.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            className={`lang-inline__option ${current === code ? "is-active" : ""}`}
            aria-pressed={current === code}
            onClick={() => change(code)}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("menu.language")}
      >
        <GlobeIcon />
        <span>{current.toUpperCase()}</span>
      </button>

      {open && (
        <ul className="lang__menu" role="listbox" aria-label={t("menu.language")}>
          {LANGUAGES.map(({ code, label }) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={current === code}
                className={`lang__option ${current === code ? "is-active" : ""}`}
                onClick={() => change(code)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
