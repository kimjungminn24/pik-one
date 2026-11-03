import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Find from "./pages/Find";
import Header from "./components/HeaderComponent";
import PrivateRoute from "./components/PrivateRoute";
import { useUserQuery } from "./hooks/useUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useTranslation } from "react-i18next";
import Info from "./pages/Info";

const Register = React.lazy(() => import("./pages/Register"));
const MyPage = React.lazy(() => import("./pages/MyPage"));
const Feedback = React.lazy(() => import("./pages/Feedback"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const ToastContainer = React.lazy(() =>
  import("react-toastify").then((mod) => ({
    default: mod.ToastContainer,
  }))
);

function App() {
  const { isLoading } = useUserQuery();

  const { i18n } = useTranslation();

  useEffect(() => {
    document.body.className = `lang-${i18n.language}`;
  }, [i18n.language]);

  useEffect(() => {
    if (isLoading) {
      const id = toast.loading("유저 정보 불러오는 중...");
      return () => toast.dismiss(id);
    }
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Router>
      <Header />
      <div className="main">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Find />} />
            <Route path="/find" element={<Navigate to="/" replace />} />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/mypage"
              element={
                <PrivateRoute>
                  <MyPage />
                </PrivateRoute>
              }
            />
            <Route path="/info" element={<Info />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <ToastContainer position="top-right" autoClose={3000} />
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
