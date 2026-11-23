import { useState } from "react";
import { useLocationStore } from "../../store/useLocationStore";
import { useResolveSharedLink } from "../../hooks/useLocation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// onMove(lat, lng): 찾은 위치로 지도를 옮긴다
export default function SharedMapLinkSearch({ onMove }) {
  const setLocation = useLocationStore((state) => state.setLocation);

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
        setLocation(parsedLat, parsedLng);
        onMove?.(parsedLat, parsedLng);
        toast.success(t("toast.map_link_success"));
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="link-form">
      <div className="link-form__label">
        <label className="field-label" htmlFor="shared-map-link">
          {t("sharedMap.label")}
        </label>
        <button type="button" className="link-form__help" aria-describedby="shared-map-help">
          ?
          <span id="shared-map-help" className="link-form__tooltip" role="tooltip">
            {t("sharedMap.help")}
          </span>
        </button>
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
