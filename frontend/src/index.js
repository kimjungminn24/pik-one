import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { errorMessageMap } from "./utils/errorMessageMap";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      onError: (error) => {
        const code = error.errorCode;
        const message =
          errorMessageMap[code] ||
          error.message ||
          "알 수 없는 오류가 발생했습니다.";

        toast.error(message);
        console.log("testsetestsetse");
        if (error.status === 401) {
          window.location.href = "/login";
        }
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        const code = error.errorCode;
        const message =
          errorMessageMap[code] ||
          error.message ||
          "알 수 없는 오류가 발생했습니다.";

        toast.error(message);

        if (error.status === 401) {
          window.location.href = "/login";
        }
      },
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
