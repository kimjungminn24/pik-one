import { create } from "zustand";

export const useLocationStore = create((set) => ({
  lat: "",
  lng: "",
  setLocation: (lat, lng) => set({ lat, lng }),

  bounds: {
    northLat: 37.58,
    southLat: 37.55,
    eastLng: 126.99,
    westLng: 126.97,
  },
  setBounds: (bounds) => set({ bounds }),
}));
