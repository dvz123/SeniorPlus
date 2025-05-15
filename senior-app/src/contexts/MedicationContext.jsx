import { createContext, useState, useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"

const MedicationContext = createContext()

export const useMedication = () => useContext(MedicationContext)

export const MedicationProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const { showSuccess, showError, showWarning } = useToast()

  const [medications, setMedications] = useState(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("token") !== null

    if (!isAuthenticated) {
      return []
    }

    const savedMedications = localStorage.getItem("medications")
    return savedMedications ? JSON.parse(savedMedications) : []
  })

  const [medicationHistory, setMedicationHistory] = useState(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("token") !== null

    if (!isAuthenticated) {
      return []
    }

    const savedHistory = localStorage.getItem("medicationHistory")
    return savedHistory ? JSON.parse(savedHistory) : []
  })

  // Limpar dados quando o usuário fizer logout
  useEffect(() => {
    if (!currentUser) {
      setMedications([])
      setMedicationHistory([])
    }
  }, [currentUser])

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("medications", JSON.stringify(medications))
    }
  }, [medications, currentUser])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("medicationHistory", JSON.stringify(medicationHistory))
    }
  }, [medicationHistory, currentUser])

  const addMedication = (name, dosage, frequency, time, startDate, endDate, instructions, notes = "") => {
    const newMedication = {
      id: uuidv4(),
      name,
      dosage,
      frequency,
      time,
      startDate,
      endDate,
      status: "active",
      instructions,
      reminders: true,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMedications([...medications, newMedication])
    showSuccess(`Medicamento ${name} adicionado com sucesso!`)
    return newMedication
  }

  const updateMedication = (id, updatedMedication) => {
    setMedications(
      medications.map((medication) => {
        if (medication.id === id) {
          return {
            ...medication,
            ...updatedMedication,
            updatedAt: new Date().toISOString(),
          }
        }
        return medication
      }),
    )
    showSuccess(`Medicamento atualizado com sucesso!`)
  }

  const deleteMedication = (id) => {
    const medicationToDelete = medications.find((med) => med.id === id)
    setMedications(medications.filter((medication) => medication.id !== id))
    if (medicationToDelete) {
      showSuccess(`Medicamento ${medicationToDelete.name} removido com sucesso!`)
    }
  }

  const recordMedicationTaken = (medicationId, taken, notes = "") => {
    const medication = medications.find((med) => med.id === medicationId)

    if (!medication) {
      showError("Medicamento não encontrado!")
      return
    }

    const newRecord = {
      id: uuidv4(),
      medicationId,
      medicationName: medication.name,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      taken,
      notes,
      createdAt: new Date().toISOString(),
    }

    setMedicationHistory([...medicationHistory, newRecord])

    if (taken) {
      showSuccess(`Medicamento ${medication.name} registrado como tomado!`)
    } else {
      showWarning(`Medicamento ${medication.name} registrado como não tomado!`)
    }

    return newRecord
  }

  const getMedicationHistory = (medicationId) => {
    return medicationHistory
      .filter((record) => record.medicationId === medicationId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const getActiveMedications = () => {
    return medications
      .filter((medication) => medication.status === "active")
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const getTodayMedications = () => {
    const today = new Date().toISOString().split("T")[0]
    return medications.filter((medication) => {
      const startDate = new Date(medication.startDate)
      const endDate = medication.endDate ? new Date(medication.endDate) : new Date(2099, 11, 31)
      const todayDate = new Date(today)
      return medication.status === "active" && startDate <= todayDate && endDate >= todayDate
    })
  }

  // Função para importar medicamentos de CSV
  const importMedicationsFromCSV = (csvData) => {
    try {
      if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
        showError("Dados CSV inválidos ou vazios")
        return []
      }

      // Processar os dados CSV e adicionar como medicamentos
      const newMedications = csvData.map((item) => ({
        id: uuidv4(),
        name: item.nome || item.name || "",
        dosage: item.dosagem || item.dosage || "",
        frequency: item.frequencia || item.frequency || "",
        time: item.horario || item.time || "",
        startDate: item.dataInicio || item.startDate || new Date().toISOString().split("T")[0],
        endDate: item.dataFim || item.endDate || "",
        status: "active",
        instructions: item.instrucoes || item.instructions || "",
        reminders: true,
        notes: item.observacoes || item.notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      // Validar os dados antes de adicionar
      const validMedications = newMedications.filter((med) => med.name && med.dosage)

      if (validMedications.length === 0) {
        showError("Nenhum medicamento válido encontrado no arquivo CSV")
        return []
      }

      setMedications((prev) => [...prev, ...validMedications])
      showSuccess(`${validMedications.length} medicamentos importados com sucesso!`)
      return validMedications
    } catch (error) {
      console.error("Erro ao importar medicamentos:", error)
      showError(`Erro ao importar medicamentos: ${error.message}`)
      return []
    }
  }

  return (
    <MedicationContext.Provider
      value={{
        medications,
        medicationHistory,
        addMedication,
        updateMedication,
        deleteMedication,
        recordMedicationTaken,
        getMedicationHistory,
        getActiveMedications,
        getTodayMedications,
        importMedicationsFromCSV,
      }}
    >
      {children}
    </MedicationContext.Provider>
  )
}

export default MedicationProvider
