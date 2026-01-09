import { handleFetchError } from "../utils/handleFetchError";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/user`;

export const fetchUser = async () => {
  const res = await fetch(`${BASE_URL}/login/check`, {
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();

  return data;
};

export const logout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
  return true;
};
