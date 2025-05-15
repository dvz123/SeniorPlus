import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import "../styles/Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Por favor, informe seu email.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      showSuccess("Email de recuperação enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar email de recuperação:", err);
      setError(err.message || "Falha ao enviar email de recuperação. Tente novamente.");
      showError("Falha ao enviar email de recuperação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Recuperar senha</h1>
          <p className="auth-subtitle">
            Digite seu email abaixo para receber instruções de redefinição.
          </p>
        </div>

        {error && (
          <div className="auth-message error">
            <span>❌ {error}</span>
          </div>
        )}
        {success && (
          <div className="auth-message success">
            <span>✅ Email enviado com sucesso! Verifique sua caixa de entrada.</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <div className="auth-input-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="auth-input-icon"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="auth-loading">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="auth-loading-icon"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Enviando...
              </span>
            ) : (
              "Enviar instruções"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Lembrou sua senha?{" "}
            <Link to="/login" className="auth-link">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
