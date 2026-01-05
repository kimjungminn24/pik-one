const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/like`;
export const postLike = async ({ id }) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleFetchError(res);
  }

  return true;
};

export const deleteLike = async ({ id }) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    await handleFetchError(res);
  }

  return true;
};
