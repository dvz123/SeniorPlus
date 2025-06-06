"use client"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "../styles/BackButton.css"

function BackButton() {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()

  const handleBack = () => {
    // Se o usuário não está logado, volta para a landing page
    if (!currentUser) {
      navigate("/")
      return
    }

    // Se está logado, implementa lógica inteligente de navegação
    const currentPath = location.pathname

    // Mapeamento de onde cada página deve voltar
    const backNavigation = {
      "/dashboard": "/dashboard", // Dashboard não volta para lugar nenhum
      "/home": "/dashboard",
      "/atualizar-dados": "/dashboard",
      "/medicamentos": "/dashboard",
      "/registrar-eventos": "/dashboard",
      "/relatorios": "/dashboard",
      "/calendario": "/dashboard",
      "/configuracoes": "/dashboard",
      "/emergencia": "/dashboard",
    }

    // Determina para onde voltar
    const backTo = backNavigation[currentPath] || "/dashboard"

    // Se já está no dashboard, não faz nada
    if (currentPath === "/dashboard" && backTo === "/dashboard") {
      return
    }

    // Navega para o destino correto
    navigate(backTo)
  }

  return (
    <button className="back-button" onClick={handleBack} aria-label="Voltar">
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
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Voltar
    </button>
  )
}

export default BackButton
