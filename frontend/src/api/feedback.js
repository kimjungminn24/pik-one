import { handleFetchError } from "../utils/handleFetchError";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/feedback`;

export const createNewFeedback = async ({ decorId, feedbackType, content }) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      decorId,
      feedbackType,
      content,
    }),
  });

  if (!res.ok) {
    await handleFetchError(res);
  }

  const data = await res.json();
  return data;
};

export const fetchMyFeedbacks = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();

  return data;
};

export const deleteMyFeedback = async ({ id }) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }

  return true;
};
