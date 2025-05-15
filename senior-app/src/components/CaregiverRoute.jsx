import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

const CaregiverRoute = ({ children }) => {
  const { currentUser } = useAuth()
  const { showError } = useToast()

  // Verificar se o usuário está autenticado
  if (!currentUser) {
    showError("Você precisa estar logado para acessar esta página.")
    return <Navigate to="/login" />
  }

  // Verificar se o usuário é um cuidador
  const isCareGiver = currentUser.role === "caregiver"

  if (!isCareGiver) {
    showError("Apenas cuidadores podem acessar esta página.")
    return <Navigate to="/" />
  }

  return children
}

export default CaregiverRoute
