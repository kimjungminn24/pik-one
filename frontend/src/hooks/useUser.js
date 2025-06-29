import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/user";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";

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
