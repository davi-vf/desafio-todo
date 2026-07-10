import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import ForgotPassword from "../components/ForgotPassword.jsx";
import Register from "../components/Register.jsx";
import StepIndicator from "../components/StepIndicator.jsx";
import { AuthContext } from "../contexts/authContext.js";
import { loginUser } from "../services/api.js";
import "../styles/Auth.css";

export default function Login() {
  const { token, handleLoginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeScreen, setActiveScreen] = useState("login");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleNextStep(event) {
    event.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Informe um e-mail válido.");
      return;
    }
    setErrorMessage("");
    setStep(2);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await loginUser({ email, password });
      handleLoginSuccess(
        result.token,
        result.user.email,
        result.user.name || "",
      );
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Não foi possível conectar ao servidor.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToLogin() {
    setActiveScreen("login");
    setStep(1);
    setErrorMessage("");
  }

  const titles = {
    login: step === 1 ? "Entrar" : "Sua senha",
    register: "Criar conta",
    forgot: "Recuperar senha",
  };

  const subtitles = {
    login:
      step === 1
        ? "Informe seu e-mail para continuar."
        : `Continuando como ${email}`,
    register: "Crie sua conta para começar.",
    forgot: "Redefina o acesso à sua conta.",
  };

  return (
    <div className="auth-page">
      <div className="auth-backdrop" />

      <header className="auth-header">
        <h1>
          Task<span>Flix</span>
        </h1>
      </header>

      <div className="auth-card">
        <h2>{titles[activeScreen]}</h2>
        <p className="auth-subtitle">{subtitles[activeScreen]}</p>

        {activeScreen === "register" && (
          <Register onSwitchToLogin={goToLogin} />
        )}

        {activeScreen === "forgot" && (
          <ForgotPassword
            initialEmail={email}
            onSwitchToLogin={goToLogin}
          />
        )}

        {activeScreen === "login" && (
          <>
            <StepIndicator current={step} total={2} />

            {step === 1 && (
              <form onSubmit={handleNextStep} className="auth-form">
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="login-email">
                    Qual é o seu e-mail?
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="auth-input"
                    placeholder="voce@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {errorMessage && (
                  <p className="auth-feedback-error">{errorMessage}</p>
                )}

                <button type="submit" className="btn-auth-submit">
                  Continuar
                </button>

                <div className="auth-divider" />

                <p className="helper-text-muted">
                  Não tem conta?
                  <button
                    type="button"
                    className="link-action-bold"
                    onClick={() => {
                      setActiveScreen("register");
                      setErrorMessage("");
                    }}
                  >
                    Criar conta
                  </button>
                </p>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="auth-input-group">
                  <label className="auth-label" htmlFor="login-password">
                    Digite sua senha
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className="auth-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {errorMessage && (
                  <p className="auth-feedback-error">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  className="btn-auth-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Entrando..." : "Entrar"}
                </button>

                <p className="helper-text-center">
                  <button
                    type="button"
                    className="link-action-muted"
                    onClick={() => {
                      setStep(1);
                      setPassword("");
                      setErrorMessage("");
                    }}
                  >
                    ← Voltar ao e-mail
                  </button>
                </p>

                <p className="helper-text-center">
                  <button
                    type="button"
                    className="link-danger-underline"
                    onClick={() => {
                      setActiveScreen("forgot");
                      setErrorMessage("");
                    }}
                  >
                    Esqueceu a senha?
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
