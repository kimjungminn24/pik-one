import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocationStore = create(
  persist(
    (set) => ({
      lat: "",
      lng: "",
      setLocation: (lat, lng) => set({ lat, lng }),

      bounds: {
        northLat: 37.58,
        southLat: 37.55,
        eastLng: 126.99,
        westLng: 126.97,
      },
      setBounds: (newBounds) =>
        set((state) => ({ bounds: { ...state.bounds, ...newBounds } })),
      isExternalUpdate: false,
      setIsExternalUpdate: (value) => set({ isExternalUpdate: value }),
    }),
    {
      name: "location-storage",
      getStorage: () => localStorage,
    }
  )
);
