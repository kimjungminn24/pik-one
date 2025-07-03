const BASE_URL = "http://localhost:8080/decors";

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
    const error = await res.text();
    throw new Error(`조회 실패: ${error}`);
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
    const error = await res.text();
    throw new Error(`등록 실패: ${error}`);
  }

  const data = await res.json();
  return data;
};

export const fetchDecorDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("상세 정보 조회 실패");
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
    const error = await res.text();
    throw new Error(`등록 실패: ${error}`);
  }

  const data = await res.json();
  return data;
};
