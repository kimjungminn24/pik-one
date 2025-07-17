import { errorMessageMap } from "./errorMessageMap";

export async function showToast(message) {
  const { toast } = await import("react-toastify");
  toast.error(message);
}

export async function showErrorToast(error) {
  const code = error.errorCode;
  const message =
    errorMessageMap[code] || error.message || "알 수 없는 오류가 발생했습니다.";

  const { toast } = await import("react-toastify");
  toast.error(message);

  if (error.status === 401) {
    window.location.href = "/login";
  }
}
