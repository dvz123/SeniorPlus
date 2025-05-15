import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { showError } = useToast();
  const { loading, currentUser } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) {
      showError("Você precisa estar logado para acessar esta página.");
    }
  }, [loading, currentUser, showError]);

  if (loading) {
    return <div className="carregando">Carregando...</div>;
  }

  if (!currentUser) {
    return (
      <>
        <p>Usuário não autenticado. Você será redirecionado para o login.</p>
        <Navigate to="/login" state={{ from: location }} replace />
      </>
    );
  }

  return children;
}

export default ProtectedRoute;
