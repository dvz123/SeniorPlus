"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar se há usuário logado no localStorage ao inicializar
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const storedUser = localStorage.getItem("currentUser")
        const isLoggedIn = localStorage.getItem("isLoggedIn")

        if (storedUser && isLoggedIn === "true") {
          setCurrentUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Erro ao verificar estado de autenticação:", error)
        // Limpar dados corrompidos
        localStorage.removeItem("currentUser")
        localStorage.removeItem("isLoggedIn")
      } finally {
        setLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const login = async (email, password, rememberMe = false) => {
    setLoading(true)
    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular validação (substitua pela lógica real)
      if (email && password) {
        const userData = {
          id: "1",
          email: email,
          name: "Carlos Gomes",
          role: "cuidador",
        }

        setCurrentUser(userData)
        localStorage.setItem("currentUser", JSON.stringify(userData))
        localStorage.setItem("isLoggedIn", "true")

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }

        return userData
      } else {
        throw new Error("Credenciais inválidas")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: "cuidador",
      }

      setCurrentUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      localStorage.setItem("isLoggedIn", "true")

      return newUser
    } catch (error) {
      console.error("Erro no registro:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setCurrentUser(null)
      localStorage.removeItem("currentUser")
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("rememberMe")

      // Limpar outros dados relacionados se necessário
      localStorage.removeItem("medications")
      localStorage.removeItem("events")
    } catch (error) {
      console.error("Erro no logout:", error)
    }
  }

  const value = {
    currentUser,
    user: currentUser, // Alias para compatibilidade
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
