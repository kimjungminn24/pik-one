import { handleFetchError } from "../utils/handleFetchError";

const OSM_BASE_URL = process.env.REACT_APP_OSM_API;

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
