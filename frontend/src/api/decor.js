import { handleFetchError } from "../utils/handleFetchError";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/decors`;

export const getDecorByTypeAndPosition = async ({
  northLat,
  southLat,
  eastLng,
  westLng,
  type,
}) => {
  const res = await fetch(
    `${BASE_URL}/search?type=${type}&westLng=${westLng}&northLat=${northLat}&southLat=${southLat}&eastLng=${eastLng}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();

  return data;
};

export const createNewDecor = async ({ lat, lng, type, content }) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat,
      lng,
      type,
      content,
    }),
  });

  if (!res.ok) {
    await handleFetchError(res);
  }

  const data = await res.json();
  return data;
};

export const deleteDecor = async ({ id }) => {
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

  return res.status === 204 ? null : await res.json();
};

export const fetchDecorDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include",
  });
  if (!res.ok) {
    await handleFetchError(res);
  }
  return res.json();
};

export const createNewFeedback = async ({ decorId, feedbackType, content }) => {
  const res = await fetch(`${BASE_URL}/feedback`, {
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

export const fetchMyDecors = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();

  return data;
};

export const fetchMyFeedbacks = async () => {
  const res = await fetch(`${BASE_URL}/me/feedbacks`, {
    credentials: "include",
  });

  if (!res.ok) {
    await handleFetchError(res);
  }
  const data = await res.json();

  return data;
};
