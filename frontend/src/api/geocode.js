import { handleFetchError } from "../utils/handleFetchError";

const OSM_BASE_URL = import.meta.env.VITE_OSM_API;

export const searchLocation = async (query) => {
  const res = await fetch(
    `${OSM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}`
  );

  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();
  return data;
};
