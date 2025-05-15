"use client";

import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { MedicationProvider } from "./contexts/MedicationContext";
import { EventsProvider } from "./contexts/EventsContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import ProtectedRoute from "./components/ProtectedRoute";
import ToastContainer from "./components/ToastContainer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import AtualizarDados from "./pages/AtualizarDados";
import Medicamentos from "./pages/Medicamentos";
import RegistrarEventos from "./pages/RegistrarEventos";
import Relatorios from "./pages/Relatorios";
import Calendario from "./pages/Calendario";
import Configuracoes from "./pages/Configuracoes";
import Emergencia from "./pages/Emergencia";

import "./styles/global.css";

function AppWrapper() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Rotas onde Header e Sidebar NÃO devem aparecer
  const hiddenRoutes = ["/login", "/registrar", "/esqueci", "/resetar-senha"];
  const shouldHideLayout = hiddenRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <UserProvider>
        <EventsProvider>
          <MedicationProvider>
            <NotificationProvider>
              <ToastContainer />
              {!shouldHideLayout && <Header toggleSidebar={toggleSidebar} />}
              {!shouldHideLayout && (
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              )}
              <main>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/registrar" element={<Register />} />
                  <Route path="/esqueci" element={<ForgotPassword />} />
                  <Route path="/resetar-senha" element={<ResetPassword />} />

                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/atualizar-dados"
                    element={
                      <ProtectedRoute>
                        <AtualizarDados />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/medicamentos"
                    element={
                      <ProtectedRoute>
                        <Medicamentos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/registrar-eventos"
                    element={
                      <ProtectedRoute>
                        <RegistrarEventos />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/relatorios"
                    element={
                      <ProtectedRoute>
                        <Relatorios />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendario"
                    element={
                      <ProtectedRoute>
                        <Calendario />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/configuracoes"
                    element={
                      <ProtectedRoute>
                        <Configuracoes />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/emergencia"
                    element={
                      <ProtectedRoute>
                        <Emergencia />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </NotificationProvider>
          </MedicationProvider>
        </EventsProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default AppWrapper;
