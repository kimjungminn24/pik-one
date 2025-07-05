import { handleFetchError } from "../utils/handleFetchError";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/user`;

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
