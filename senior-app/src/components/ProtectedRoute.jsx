import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useRef } from "react";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { showError } = useToast();
  const { loading, currentUser } = useAuth();
  const hasShownError = useRef(false);

  useEffect(() => {
    if (!loading && !currentUser && !hasShownError.current) {
      showError("Você precisa estar logado para acessar esta página.");
      hasShownError.current = true; // Evita mostrar a mensagem várias vezes
    }
  }, [loading, currentUser, showError]);

  if (loading) {
    return <div className="carregando">Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
