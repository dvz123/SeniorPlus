import { useState, useEffect, useCallback } from "react"
import Toast from "./Toast"
import "../styles/ToastContainer.css"

// Cria um ID único para cada toast
let toastId = 0

function ToastContainer() {
  const [toasts, setToasts] = useState([])

  // Função para adicionar um novo toast
  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = toastId++
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
    return id
  }, [])

  // Função para remover um toast
  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  // Expor as funções para o window para que possam ser chamadas de qualquer lugar
  useEffect(() => {
    window.toast = {
      success: (message, duration) => addToast(message, "success", duration),
      error: (message, duration) => addToast(message, "error", duration),
      warning: (message, duration) => addToast(message, "warning", duration),
      info: (message, duration) => addToast(message, "info", duration),
    }

    return () => {
      delete window.toast
    }
  }, [addToast])

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer
