import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
  setUser: (user) => set({ user, isLogin: true }),
  logout: () => set({ user: null, isLogin: false }),
}));
