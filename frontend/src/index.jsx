import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { showErrorToast } from "./utils/toast";
import "./i18n";

// v5부터 defaultOptions.queries.onError 무시됨 → 캐시 레벨 onError로 전역 처리
// meta.silent 쿼리는 실패해도 토스트 안 띄움 (로그인 체크 등)
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.silent) return;
      showErrorToast(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      showErrorToast(error);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
