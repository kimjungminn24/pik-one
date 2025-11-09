import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { showErrorToast } from "./utils/toast";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      onError: (error) => {
        showErrorToast(error);
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        showErrorToast(error);
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
