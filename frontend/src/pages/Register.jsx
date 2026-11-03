import React, { Suspense, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { decorList } from "../decorList";
import TagListComponent from "../components/TagListComponent";
import CoordinateRegister from "../components/CoordinateRegister";
import SharedMapLinkSearch from "../components/report/SharedMapLinkSearch";
import PlaceSearch from "../components/explore/PlaceSearch";
import FlyTo from "../components/map/FlyTo";
import MapControls from "../components/map/MapControls";
import { useLocationStore } from "../store/useLocationStore";
import { useUserStore } from "../store/useUserStore";
import { useCreateDecor } from "../hooks/useDecor";
import { useBottomSheet } from "../hooks/useBottomSheet";
import "../css/explore.scss";
import "../css/page.scss";
import "../css/register.scss";

const LazyMap = React.lazy(() => import("../components/map/MapComponent"));

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [flyTarget, setFlyTarget] = useState(null);
  const [sheetSnap, setSheetSnap] = useState("half");
  const { lat, lng, setLocation } = useLocationStore();
  const isLogin = useUserStore((state) => state.isLogin);
  const { mutate, isPending } = useCreateDecor();

  const panelRef = useRef(null);
  const toggleSheet = () => setSheetSnap((prev) => (prev === "full" ? "half" : "full"));
  const sheetDrag = useBottomSheet(
    panelRef,
    sheetSnap,
    setSheetSnap,
    toggleSheet,
    ".explore__sheet-handle"
  );

  const handleSubmit = () => {
    if (!lat || !lng) {
      toast.error(t("toast.register_pos_error"));
      return;
    }
    if (!content || !selectedTag) {
      toast.error(t("toast.register_input_error"));
      return;
    }

    mutate(
      {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        type: selectedTag,
        content,
      },
      {
        onSuccess: (spot) => {
          toast.success(t("toast.decor_success"));
          // 찾기 화면에서 방금 등록한 스팟을 바로 열어 준다
          navigate("/", { state: { registered: spot } });
        },
      }
    );

    setContent("");
    setSelectedTag("");
  };

  return (
    <div className={`explore explore--sheet-${sheetSnap}`}>
      <PlaceSearch
        className="explore__search"
        onFound={({ lat: fLat, lng: fLng }) =>
          setFlyTarget({ lat: fLat, lng: fLng, zoom: 17, key: Date.now() })
        }
      />

      <aside
        ref={panelRef}
        className={`explore__panel is-${sheetSnap}`}
        aria-label={t("menu.register")}
        {...sheetDrag}
      >
        <button
          type="button"
          className="explore__sheet-handle"
          onClick={(e) => e.detail === 0 && toggleSheet()}
          aria-expanded={sheetSnap === "full"}
          aria-label={t(sheetSnap === "full" ? "explore.collapse" : "explore.expand")}
        />

        <div className="explore__body">
          <section className="panel-section">
            <h2 className="panel-section__title">{t("register.section_location")}</h2>
            <CoordinateRegister />
            <SharedMapLinkSearch />
          </section>

          <section className="panel-section">
            <label className="panel-section__title" htmlFor="register-content">
              {t("register.section_desc")}
            </label>
            <input
              id="register-content"
              className="field"
              type="text"
              placeholder={t("register.placeholder")}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </section>

          <section className="panel-section">
            <h2 className="panel-section__title">{t("register.section_type")}</h2>
            <TagListComponent
              items={decorList}
              isSelected={(item) => selectedTag === item.name}
              onTagClick={(item) => setSelectedTag(item.name)}
            />
          </section>
        </div>
      </aside>

      <div className="explore__footer">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? t("register.submitting") : t("register.submit")}
        </button>
        {!isLogin && (
          <p className="register-anon">
            {t("register.anonymous_notice")}{" "}
            <Link to="/login">{t("register.anonymous_login")}</Link>
          </p>
        )}
      </div>

      <div className="explore__map">
        <Suspense fallback={<div className="explore__map-loading">{t("find.mapLoading")}</div>}>
          <LazyMap>
            <FlyTo target={flyTarget} />
            <MapControls onLocate={(fLat, fLng) => setLocation(fLat.toFixed(6), fLng.toFixed(6))} />
          </LazyMap>
        </Suspense>
      </div>
    </div>
  );
}
