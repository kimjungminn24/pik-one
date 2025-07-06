import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { toast } from "react-toastify";

export default function PrivateRoute({ children }) {
  const isLogin = useUserStore((state) => state.isLogin);
  useEffect(() => {
    if (!isLogin) {
      toast.info("로그인 후 이용해 주세요", { autoClose: 2000 });
    }
  }, [isLogin]);

  return isLogin ? children : <Navigate to="/" replace />;
}
