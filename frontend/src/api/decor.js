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
