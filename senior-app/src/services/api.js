// Configuração básica para API
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Variável interna para armazenar o token em memória
let authToken = null;

// Função para simular respostas da API em desenvolvimento
function simulateResponse(endpoint, data = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (endpoint.includes("/auth/login")) {
        resolve({
          user: {
            id: "1",
            name: "Usuário Teste",
            email: data.email || "usuario@teste.com",
          },
          token: "mock-jwt-token",
        });
      } else if (endpoint.includes("/auth/register")) {
        resolve({
          user: {
            id: "1",
            name: data.name || "Novo Usuário",
            email: data.email || "novo@usuario.com",
          },
          token: "mock-jwt-token",
        });
      } else if (endpoint.includes("/auth/me")) {
        resolve({
          id: "1",
          name: "Usuário Teste",
          email: "usuario@teste.com",
        });
      } else if (endpoint.includes("/elderly")) {
        resolve({
          id: "1",
          name: "João da Silva",
          birthDate: "1940-05-15",
          address: "Rua das Flores, 123",
          phone: "(11) 99999-8888",
        });
      } else {
        resolve({ success: true });
      }
    }, 500);
  });
}

// API methods
export const api = {
  // Função para fazer requisições GET
  get: async (endpoint) => {
    try {
      // Em desenvolvimento, retornamos dados simulados
      if (process.env.NODE_ENV === "development") {
        return simulateResponse(endpoint);
      }

      // Usa token da memória ou localStorage ou sessionStorage
      const token =
        authToken || localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição GET:", error);
      throw error;
    }
  },

  // Função para fazer requisições POST
  post: async (endpoint, data) => {
    try {
      // Em desenvolvimento, retornamos dados simulados
      if (process.env.NODE_ENV === "development") {
        return simulateResponse(endpoint, data);
      }

      const token =
        authToken || localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição POST:", error);
      throw error;
    }
  },

  // Função para fazer requisições PUT
  put: async (endpoint, data) => {
    try {
      // Em desenvolvimento, retorna dados simulados
      if (process.env.NODE_ENV === "development") {
        return simulateResponse(endpoint, data);
      } const token =
        authToken || localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
      throw error;
    }
  },

  setAuthToken: (token) => {
    authToken = token;
  },
};
