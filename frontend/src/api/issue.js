import { handleFetchError } from "../utils/handleFetchError";
const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/issue`;

export const postIssue = async ({ body }) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
};

export const getIssues = async () => {
  const res = await fetch(`${BASE_URL}`);

  if (!res.ok) {
    await handleFetchError(res);
  }
  return res.json();
};
