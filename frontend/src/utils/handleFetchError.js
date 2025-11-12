export async function handleFetchError(res) {
  const errorBody = await res.json();

  const baseError = new Error(errorBody.message || "알 수 없는 에러");

  const error = Object.assign(baseError, {
    status: res.status,
    errorCode: errorBody.errorCode,
  });

  throw error;
}
