import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
          if (process.env.REACT_APP_MODE === "demo") {
            // Modo demo: retorna usuário fixo
            setCurrentUser({
              id: "1",
              name: "Usuário Teste",
              email: "usuario@teste.com",
            });
            api.setAuthToken(token);
          } else {
            try {
              api.setAuthToken(token);
              const response = await api.get("/auth/me");
              setCurrentUser(response.data);
            } catch (apiError) {
              console.error("Erro ao obter dados do usuário:", apiError);
              localStorage.removeItem("token");
              sessionStorage.removeItem("token");
              api.setAuthToken(null);
              setCurrentUser(null);
            }
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      setError(null);

      if (process.env.REACT_APP_MODE === "demo") {
        // Simulação de login no modo demo
        const mockUser = {
          id: "1",
          name: "Usuário Teste",
          email,
        };
        const mockToken = "mock-jwt-token";

        if (rememberMe) {
          localStorage.setItem("token", mockToken);
        } else {
          sessionStorage.setItem("token", mockToken);
        }

        api.setAuthToken(mockToken);
        setCurrentUser(mockUser);
        return mockUser;
      }

      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      api.setAuthToken(token);
      setCurrentUser(user);

      if (!user) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        api.setAuthToken(null);
      }

      return user;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError(error.message || "Falha ao fazer login");
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);

      if (process.env.REACT_APP_MODE === "demo") {
        const mockUser = { id: "1", name, email };
        return mockUser;
      }

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setError(error.message || "Falha ao registrar");
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      api.setAuthToken(null);
      setCurrentUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError(error.message || "Falha ao fazer logout");
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      if (process.env.REACT_APP_MODE === "demo") {
        return { success: true };
      }
      const response = await api.post("/auth/reset-password", { email });
      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      setError(error.message || "Falha ao solicitar redefinição de senha");
      throw error;
    }
  };

  const confirmPasswordReset = async (token, newPassword) => {
    try {
      setError(null);
      if (process.env.REACT_APP_MODE === "demo") {
        return { success: true };
      }
      const response = await api.post("/auth/confirm-reset-password", {
        token,
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao confirmar redefinição de senha:", error);
      setError(error.message || "Falha ao confirmar redefinição de senha");
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      if (!currentUser) throw new Error("Usuário não autenticado");

      if (process.env.REACT_APP_MODE === "demo") {
        const updatedUser = { ...currentUser, ...userData };
        setCurrentUser(updatedUser);
        return updatedUser;
      }

      const response = await api.put("/auth/profile", userData);
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setError(error.message || "Falha ao atualizar perfil");
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      if (!currentUser) throw new Error("Usuário não autenticado");

      if (process.env.REACT_APP_MODE === "demo") {
        return { success: true };
      }

      const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setError(error.message || "Falha ao alterar senha");
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    confirmPasswordReset,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
