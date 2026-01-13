import React, { useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useResolveSharedLink } from "../../hooks/useLocation";
import { useTranslation } from "react-i18next";

export default function SharedMapLinkSearch() {
  const { setLocation, setBounds, setIsExternalUpdate } = useLocationStore();

  const [url, setUrl] = useState("");
  const { mutate, isPending } = useResolveSharedLink();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    mutate(url, {
      onSuccess: ({ lat, lng }) => {
        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
          return;
        }

        setIsExternalUpdate(true);
        setLocation(parsedLat, parsedLng);

        const offset = 0.03;
        setBounds({
          northLat: parsedLat + offset,
          southLat: parsedLat - offset,
          eastLng: parsedLng + offset,
          westLng: parsedLng - offset,
        });

        setTimeout(() => setIsExternalUpdate(false), 500);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="coordinate-register-form">
      <div className="coordinate-register-form-outer">
        <label className="coordinate-register-form-label ">
          {t("sharedMap.label")}
        </label>

        <input
          value={url}
          placeholder={t("sharedMap.placeholder")}
          className="coordinate-register-form-input"
          onChange={(e) => setUrl(e.target.value)}
          disabled={isPending}
        />
      </div>

      <button type="submit" disabled={isPending || !url.trim()}>
        {isPending ? t("sharedMap.loading") : t("sharedMap.submit")}
      </button>
      <span
        className="help-tooltip emoji"
        tabIndex={0}
        aria-label={t("sharedMap.label")}
      >
        ❓
        <span className="help-tooltip-text" role="tooltip">
          {t("sharedMap.help")}
        </span>
      </span>
    </form>
  );
}
