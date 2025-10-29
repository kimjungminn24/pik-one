export default function Login() {
  const handleLogin = (provider) => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="page-layout">
      <div className="page-section">
        <div className="login">
          <p className="login__title">간편 로그인으로 빠르게 시작하기</p>
          <button
            className="login__btn login__btn--kakao"
            onClick={() => handleLogin("kakao")}
          >
            <img src="/kakao-btn.png" alt="kakao login" />
          </button>

          <button
            className="login__btn login__btn--naver"
            onClick={() => handleLogin("naver")}
          >
            <img src="/naver-btn.png" alt="naver login" />
          </button>

          <button
            className="login__btn login__btn--google"
            onClick={() => handleLogin("google")}
          >
            <img src="/google-btn.png" alt="google login" />
          </button>
        </div>
      </div>
    </div>
  );
}
