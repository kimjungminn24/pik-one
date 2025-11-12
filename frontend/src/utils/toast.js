import i18next from "i18next";

import { errorMessageMap } from "./errorMessageMap";

export async function showToast(messageKey) {
  const { toast } = await import("react-toastify");

  const message = i18next.exists(messageKey)
    ? i18next.t(messageKey)
    : messageKey;
  toast.error(message);
}

export async function showErrorToast(error) {
  const { toast } = await import("react-toastify");
  const fallback = i18next.t("toast.error", "알 수 없는 오류가 발생했습니다.");

  const code = error?.errorCode;

  const message =
    (code && i18next.exists(`error.${code}`) && i18next.t(`error.${code}`)) ||
    errorMessageMap[code] ||
    error?.message ||
    fallback;
  toast.error(message);

  if (error.status === 401) {
    window.location.href = "/login";
  }
}
