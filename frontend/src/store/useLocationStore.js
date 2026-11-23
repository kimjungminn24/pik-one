import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 소수 6자리(약 10cm)로 맞춰 저장. 같은 위치면 같은 값이 되게
export const round6 = (value) => Math.round(Number(value) * 1e6) / 1e6;

const toCoord = (value) =>
  value === "" || value == null || Number.isNaN(Number(value)) ? null : round6(value);

const DEFAULT_BOUNDS = {
  northLat: 37.58,
  southLat: 37.55,
  eastLng: 126.99,
  westLng: 126.97,
};

export const useLocationStore = create(
  persist(
    (set) => ({
      // 등록 화면에서 고른 위치
      lat: null,
      lng: null,
      setLocation: (lat, lng) => set({ lat: toCoord(lat), lng: toCoord(lng) }),

      bounds: DEFAULT_BOUNDS,
      setBounds: (newBounds) =>
        set((state) => ({ bounds: { ...state.bounds, ...newBounds } })),
      zoom: 15,
      setZoom: (zoom) => set({ zoom }),
    }),
    {
      name: "location-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: ({ lat, lng, bounds, zoom }) => ({ lat, lng, bounds, zoom }),
      // 예전에는 좌표를 "37.123456" 같은 문자열로 저장했다
      migrate: (persisted) => {
        const old = persisted ?? {};
        const bounds = Object.fromEntries(
          Object.entries(DEFAULT_BOUNDS).map(([key, fallback]) => [
            key,
            toCoord(old.bounds?.[key]) ?? fallback,
          ])
        );
        return {
          lat: toCoord(old.lat),
          lng: toCoord(old.lng),
          bounds,
          zoom: Number(old.zoom) || 15,
        };
      },
    }
  )
);
