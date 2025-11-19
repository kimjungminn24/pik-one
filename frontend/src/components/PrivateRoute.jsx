import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PrivateRoute({ children }) {
  const isLogin = useUserStore((state) => state.isLogin);
  const { t } = useTranslation();
  useEffect(() => {
    if (!isLogin) {
      toast.info(t("toast.login_required"), { autoClose: 2000 });
    }
  }, [isLogin, t]);

  return isLogin ? children : <Navigate to="/" replace />;
}
