import React, { Suspense, useState } from "react";
import { decorList } from "../decorList";
import TagListComponent from "../components/TagListComponent";
import { useLocationStore } from "../store/useLocationStore";
import { useCreateDecor } from "../hooks/useDecor";
import { toast } from "react-toastify";
import "../css/register.scss";
import CoordinateRegister from "../components/CoordinateRegister";
import { useTranslation } from "react-i18next";

const LazyMap = React.lazy(() => import("../components/map/MapComponent"));

export default function Register() {
  const [content, setContent] = useState("");
  const { lat, lng } = useLocationStore();
  const [selectedTag, setSelectedTag] = useState("");
  const { mutate, isPending } = useCreateDecor();

  const { t } = useTranslation();

  const handleTagClick = (item) => {
    setSelectedTag(item.name);
  };
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
        onSuccess: () => {
          toast.success(t("toast.decor_success"));
          setContent("");
          setSelectedTag("");
        },
      }
    );

    setContent("");
    setSelectedTag("");
  };

  return (
    <div className="page-layout">
      <div className="page-section">
        <Suspense fallback={<div>{t("find.mapLoading")}</div>}>
          <LazyMap />
        </Suspense>
      </div>
      <div className="page-section">
        <div className="form-group">
          <CoordinateRegister lat={lat} lng={lng} />
        </div>
        <div className="form-group"></div>
        <div className="form-group">
          <input
            className="register-form__input"
            type="text"
            placeholder={t("register.placeholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <TagListComponent
          items={decorList}
          isSelected={(item) => selectedTag === item.name}
          onTagClick={handleTagClick}
        />
        <div className="button-box">
          <button onClick={handleSubmit} disabled={isPending}>
            {isPending ? t("register.submitting") : t("register.submit")}
          </button>
        </div>
      </div>
    </div>
  );
}
