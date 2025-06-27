import { create } from "zustand";

export const useLocationStore = create((set) => ({
  lat: "",
  lng: "",
  setLocation: (lat, lng) => set({ lat, lng }),

  bounds: {
    northLat: "",
    southLat: "",
    eastLng: "",
    westLng: "",
  },
  setBounds: (bounds) => set({ bounds }),
}));
