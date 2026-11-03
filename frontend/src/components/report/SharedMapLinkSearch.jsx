import React, { useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useResolveSharedLink } from "../../hooks/useLocation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function SharedMapLinkSearch() {
  const { setLocation, setBounds, setIsExternalUpdate } = useLocationStore();

  const [url, setUrl] = useState("");
  const { mutate, isPending } = useResolveSharedLink();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.warn(t("toast.map_link_empty"));
      return;
    }
    mutate(url, {
      onSuccess: ({ lat, lng }) => {
        const parsedLat = Number(lat);
        const parsedLng = Number(lng);

        if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
          toast.warn(t("toast.map_link_parse_error"));
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
        toast.success(t("toast.map_link_success"));

        setTimeout(() => setIsExternalUpdate(false), 500);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="link-form">
      <div className="link-form__label">
        <label className="field-label" htmlFor="shared-map-link">
          {t("sharedMap.label")}
        </label>
        <span className="link-form__help" tabIndex={0} aria-describedby="shared-map-help">
          ?
          <span id="shared-map-help" className="link-form__tooltip" role="tooltip">
            {t("sharedMap.help")}
          </span>
        </span>
      </div>
      <div className="link-form__row">
        <input
          id="shared-map-link"
          value={url}
          placeholder={t("sharedMap.placeholder")}
          className="field"
          onChange={(e) => setUrl(e.target.value)}
          disabled={isPending}
        />
        <button
          type="submit"
          className="btn btn--secondary"
          disabled={isPending || !url.trim()}
        >
          {isPending ? t("sharedMap.loading") : t("sharedMap.submit")}
        </button>
      </div>
    </form>
  );
}
