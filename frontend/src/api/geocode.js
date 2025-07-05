import { handleFetchError } from "../utils/handleFetchError";

export const searchLocation = async (query) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();
  return data;
};
