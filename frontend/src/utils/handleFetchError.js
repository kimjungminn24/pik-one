export async function handleFetchError(res) {
  // nginx가 직접 돌려주는 응답(429 등)은 JSON이 아닐 수 있음
  const errorBody = await res.json().catch(() => ({}));
  if (res.status === 429) errorBody.errorCode ??= "TOO_MANY_REQUESTS";

  const baseError = new Error(errorBody.message || "알 수 없는 에러");

  const error = Object.assign(baseError, {
    status: res.status,
    errorCode: errorBody.errorCode,
  });

  throw error;
}
