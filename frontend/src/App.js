import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Header from "./components/HeaderComponent";
import Find from "./pages/Find";
import MyPage from "./pages/MyPage";
import { useUserQuery } from "./hooks/useUser";
import { ToastContainer, toast } from "react-toastify";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

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
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
