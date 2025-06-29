export const fetchUser = async () => {
  const res = await fetch("http://localhost:8080/user/login/check", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }
  const data = await res.json();

  return data;
};
