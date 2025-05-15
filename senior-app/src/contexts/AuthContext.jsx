import { createContext, useState, useContext, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para limpar tokens e estado
  const clearAuthData = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    api.setAuthToken(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (token) {
          if (process.env.REACT_APP_MODE === "demo") {
            // Modo demo: usuário fixo
            setCurrentUser({
              id: "1",
              name: "Usuário Teste",
              email: "usuario@teste.com",
            });
            api.setAuthToken(token);
          } else {
            api.setAuthToken(token);
            const response = await api.get("/auth/me");
            setCurrentUser(response.data);
          }
        } else {
          setCurrentUser(null);
        }
      } catch (apiError) {
        console.error("Erro ao obter dados do usuário:", apiError);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Realiza login do usuário
   * @param {string} email
   * @param {string} password
   * @param {boolean} rememberMe
   */
  const login = async (email, password, rememberMe = false) => {
    try {
      setError(null);

      if (process.env.REACT_APP_MODE === "demo") {
        const mockUser = {
          id: "1",
          name: "Usuário Teste",
          email,
        };
        const mockToken = "mock-jwt-token";

        if (rememberMe) localStorage.setItem("token", mockToken);
        else sessionStorage.setItem("token", mockToken);

        api.setAuthToken(mockToken);
        setCurrentUser(mockUser);
        return mockUser;
      }

      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      if (rememberMe) localStorage.setItem("token", token);
      else sessionStorage.setItem("token", token);

      api.setAuthToken(token);
      setCurrentUser(user);

      if (!user) clearAuthData();

      return user;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao fazer login";
      console.error("Erro ao fazer login:", msg);
      setError(msg);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);

      if (process.env.REACT_APP_MODE === "demo") {
        return { id: "1", name, email };
      }

      const response = await api.post("/auth/register", { name, email, password });
      return response.data;
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao registrar";
      console.error("Erro ao registrar:", msg);
      setError(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      clearAuthData();
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao fazer logout";
      console.error("Erro ao fazer logout:", msg);
      setError(msg);
      throw err;
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
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao solicitar redefinição de senha";
      console.error("Erro ao solicitar redefinição de senha:", msg);
      setError(msg);
      throw err;
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
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao confirmar redefinição de senha";
      console.error("Erro ao confirmar redefinição de senha:", msg);
      setError(msg);
      throw err;
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
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao atualizar perfil";
      console.error("Erro ao atualizar perfil:", msg);
      setError(msg);
      throw err;
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
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Falha ao alterar senha";
      console.error("Erro ao alterar senha:", msg);
      setError(msg);
      throw err;
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
