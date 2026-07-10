import { useState } from "react";
import { resetPassword } from "../services/api.js";
import StepIndicator from "./StepIndicator.jsx";

export default function ForgotPassword({ onSwitchToLogin, initialEmail = "" }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(initialEmail);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNextEmail(event) {
    event.preventDefault();
    if (!email.trim()) {
      setErrorMessage("Informe um e-mail válido.");
      return;
    }
    setErrorMessage("");
    setStep(2);
  }

  function handleNextCode(event) {
    event.preventDefault();
    if (!resetCode.trim()) {
      setErrorMessage("Informe o código de recuperação.");
      return;
    }
    setErrorMessage("");
    setStep(3);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        email,
        resetCode,
        password: newPassword,
      });
      setSuccessMessage("Senha atualizada com sucesso!");
      setTimeout(() => onSwitchToLogin(), 1400);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Não foi possível atualizar a senha. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <StepIndicator current={step} total={3} />

      {step === 1 && (
        <form onSubmit={handleNextEmail} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="forgot-email">
              Qual é o seu e-mail?
            </label>
            <input
              id="forgot-email"
              type="email"
              className="auth-input"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>

          {errorMessage && <p className="auth-feedback-error">{errorMessage}</p>}

          <button type="submit" className="btn-auth-submit">
            Continuar
          </button>

          <p className="helper-text-muted">
            Lembrou a senha?
            <button
              type="button"
              className="link-action-bold"
              onClick={onSwitchToLogin}
            >
              Voltar ao login
            </button>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNextCode} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="forgot-code">
              Digite o código de verificação
            </label>
            <input
              id="forgot-code"
              type="text"
              className="auth-input"
              placeholder="Use 1234"
              value={resetCode}
              onChange={(event) => setResetCode(event.target.value)}
              required
              autoFocus
            />
          </div>

          <p className="auth-hint">Código de desenvolvimento: 1234</p>

          {errorMessage && <p className="auth-feedback-error">{errorMessage}</p>}

          <button type="submit" className="btn-auth-submit">
            Continuar
          </button>

          <p className="helper-text-center">
            <button
              type="button"
              className="link-action-muted"
              onClick={() => {
                setStep(1);
                setErrorMessage("");
              }}
            >
              ← Voltar ao e-mail
            </button>
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <label className="auth-label" htmlFor="forgot-password">
              Crie sua nova senha
            </label>
            <input
              id="forgot-password"
              type="password"
              className="auth-input"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              autoFocus
            />
          </div>

          {errorMessage && <p className="auth-feedback-error">{errorMessage}</p>}
          {successMessage && (
            <p className="auth-feedback-success">{successMessage}</p>
          )}

          <button
            type="submit"
            className="btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Atualizar senha"}
          </button>

          <p className="helper-text-center">
            <button
              type="button"
              className="link-action-muted"
              onClick={() => {
                setStep(2);
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              ← Voltar ao código
            </button>
          </p>
        </form>
      )}
    </>
  );
}
