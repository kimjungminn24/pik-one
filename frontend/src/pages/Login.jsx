import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/login.scss";

const PROVIDERS = [
  { id: "kakao", image: "/kakao-btn.png", label: "Kakao" },
  { id: "naver", image: "/naver-btn.png", label: "Naver" },
  { id: "google", image: "/google-btn.png", label: "Google" },
];

export default function Login() {
  const { t } = useTranslation();

  const handleLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-page">
      <section className="login">
        <h1 className="login__title">{t("menu.login")}</h1>
        {PROVIDERS.map(({ id, image, label }) => (
          <button
            key={id}
            type="button"
            className="login__btn"
            onClick={() => handleLogin(id)}
          >
            <img src={image} alt={`${label} login`} width="300" height="60" />
          </button>
        ))}
        <Link to="/privacy" className="login__privacy">
          {t("footer.privacy")}
        </Link>
      </section>
    </div>
  );
}
