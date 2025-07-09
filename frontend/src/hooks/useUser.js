import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUser, logout } from "../api/user";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useUserQuery = () => {
  const setIsLogin = useUserStore((state) => state.setIsLogin);
  const logout = useUserStore((state) => state.logout);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (query.data) {
      if (query.data.isLogin) {
        setIsLogin(true);
      } else {
        logout();
      }
    }
  }, [query.data, setIsLogin, logout]);

  return query;
};

export const useLogoutMutation = () => {
  const logoutStore = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logoutStore();
      navigate("/");
    },
  });
};
