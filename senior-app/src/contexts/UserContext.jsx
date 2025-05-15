import { createContext, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext"

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth()

  const [elderlyData, setElderlyData] = useState(() => {
    // Verifica se o usuário está autenticado (token existe)
    const isAuthenticated = localStorage.getItem("token") !== null

    if (!isAuthenticated) {
      return null
    }

    // Tenta carregar dados do idoso do localStorage
    const savedData = localStorage.getItem("elderlyData")
    return savedData ? JSON.parse(savedData) : null
  })

  // Atualiza elderlyData quando currentUser mudar
  useEffect(() => {
    if (!currentUser) {
      setElderlyData(null)
      return
    }

    // Se não houver dados do idoso e o usuário for cuidador, inicializa com dados vazios
    if (!elderlyData && isCareGiver()) {
      const emptyData = {
        name: "",
        id: "",
        age: "",
        bloodType: "",
        maritalStatus: "",
        allergies: [],
        address: "",
        phone: "",
        emergencyContact: "",
        medicalConditions: [],
        medications: [],
      }
      setElderlyData(emptyData)
      localStorage.setItem("elderlyData", JSON.stringify(emptyData))
    }
  }, [currentUser, elderlyData])

  // Salva elderlyData no localStorage sempre que mudar
  useEffect(() => {
    if (elderlyData) {
      localStorage.setItem("elderlyData", JSON.stringify(elderlyData))
    }
  }, [elderlyData])

  // Atualiza dados do idoso de forma merge
  const updateElderlyData = (data) => {
    setElderlyData((prev) => {
      const updatedData = { ...prev, ...data }
      return updatedData
    })
  }

  // Função para verificar se o usuário atual é cuidador
  const isCareGiver = () => {
    if (!currentUser) return false
    return currentUser.role === "caregiver"
  }

  // Função para verificar se o usuário atual é idoso
  const isElderly = () => {
    if (!currentUser) return false
    return currentUser.role === "elderly"
  }

  return (
    <UserContext.Provider
      value={{
        elderlyData,
        updateElderlyData,
        user: elderlyData, // para compatibilidade com código existente
        isCareGiver,
        isElderly,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
