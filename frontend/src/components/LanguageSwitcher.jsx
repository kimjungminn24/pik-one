import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const languages = [
    { code: "ko", label: "한국어" },
    { code: "ja", label: "日本語" },
    { code: "en", label: "English" },
  ];

  return (
    <div className="lang-switcher">
      {!open && (
        <button className="lang-button" onClick={() => setOpen(!open)}>
          <span className="emoji">🌍</span>
        </button>
      )}

      {open && (
        <div className="lang-dropdown">
          {languages.map(({ code, label }) => (
            <button
              key={code}
              className={`lang-option ${
                i18n.language === code ? "active" : ""
              }`}
              onClick={() => {
                i18n.changeLanguage(code);
                setOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
