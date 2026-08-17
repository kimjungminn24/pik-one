import { handleFetchError } from "../utils/handleFetchError";
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/location/resolve`;

export const fetchCoordinatesFromSharedLink = async (sharedUrl) => {
  const res = await fetch(`${BASE_URL}?url=${encodeURIComponent(sharedUrl)}`, {
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
  return res.json();
};
