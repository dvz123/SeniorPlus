import { createContext, useState, useContext, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"

const EventsContext = createContext()

export const useEvents = () => useContext(EventsContext)

export const EventsProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const { showSuccess, showError } = useToast()

  const [events, setEvents] = useState(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("token") !== null

    if (!isAuthenticated) {
      return []
    }

    const savedEvents = localStorage.getItem("events")
    return savedEvents ? JSON.parse(savedEvents) : []
  })

  // Limpar dados quando o usuário fizer logout
  useEffect(() => {
    if (!currentUser) {
      setEvents([])
    }
  }, [currentUser])

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("events", JSON.stringify(events))
    }
  }, [events, currentUser])

  const addEvent = (title, date, startTime, endTime, location, description, category) => {
    const newEvent = {
      id: uuidv4(),
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      category: category || "Outro",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setEvents([...events, newEvent])
    showSuccess(`Evento "${title}" adicionado com sucesso!`)
    return newEvent
  }

  const updateEvent = (id, updatedEvent) => {
    setEvents(
      events.map((event) => {
        if (event.id === id) {
          return {
            ...event,
            ...updatedEvent,
            updatedAt: new Date().toISOString(),
          }
        }
        return event
      }),
    )
    showSuccess(`Evento atualizado com sucesso!`)
  }

  const deleteEvent = (id) => {
    const eventToDelete = events.find((event) => event.id === id)
    setEvents(events.filter((event) => event.id !== id))
    if (eventToDelete) {
      showSuccess(`Evento "${eventToDelete.title}" removido com sucesso!`)
    }
  }

  const getTodayEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    return events.filter((event) => event.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getEventsByDate = (date) => {
    return events.filter((event) => event.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getEventsByDateRange = (startDate, endDate) => {
    return events
      .filter((event) => {
        return event.date >= startDate && event.date <= endDate
      })
      .sort((a, b) => {
        // Primeiro ordenar por data
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date)
        }
        // Se a data for a mesma, ordenar por hora de início
        return a.startTime.localeCompare(b.startTime)
      })
  }

  const getEventsByCategory = (category) => {
    return events.filter((event) => event.category === category).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  // Função para importar eventos de CSV
  const importEventsFromCSV = (csvData) => {
    try {
      if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
        showError("Dados CSV inválidos ou vazios")
        return []
      }

      // Processar os dados CSV e adicionar como eventos
      const newEvents = csvData.map((item) => ({
        id: uuidv4(),
        title: item.titulo || item.title || "",
        date: item.data || item.date || new Date().toISOString().split("T")[0],
        startTime: item.horaInicio || item.startTime || "",
        endTime: item.horaFim || item.endTime || "",
        location: item.local || item.location || "",
        description: item.descricao || item.description || "",
        category: item.categoria || item.category || "Outro",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      // Validar os dados antes de adicionar
      const validEvents = newEvents.filter((event) => event.title && event.date && event.startTime)

      if (validEvents.length === 0) {
        showError("Nenhum evento válido encontrado no arquivo CSV")
        return []
      }

      setEvents((prev) => [...prev, ...validEvents])
      showSuccess(`${validEvents.length} eventos importados com sucesso!`)
      return validEvents
    } catch (error) {
      console.error("Erro ao importar eventos:", error)
      showError(`Erro ao importar eventos: ${error.message}`)
      return []
    }
  }

  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        getTodayEvents,
        getEventsByDate,
        getEventsByDateRange,
        getEventsByCategory,
        importEventsFromCSV,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export default EventsProvider
