import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/HeaderComponent";
import PrivateRoute from "./components/PrivateRoute";
import { useUserQuery } from "./hooks/useUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const Register = React.lazy(() => import("./pages/Register"));
const Find = React.lazy(() => import("./pages/Find"));
const MyPage = React.lazy(() => import("./pages/MyPage"));
const ToastContainer = React.lazy(() =>
  import("react-toastify").then((mod) => ({
    default: mod.ToastContainer,
  }))
);

function App() {
  const { isLoading } = useUserQuery();

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
        <Suspense fallback={<div>로딩 중...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/register"
              element={
                <PrivateRoute>
                  <Register />
                </PrivateRoute>
              }
            />
            <Route path="/find" element={<Find />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/mypage"
              element={
                <PrivateRoute>
                  <MyPage />
                </PrivateRoute>
              }
            />
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
