const BASE_URL = "http://localhost:8080/user";

export const fetchUser = async () => {
  const res = await fetch(`${BASE_URL}/login/check`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  const data = await res.json();

  return data;
};
