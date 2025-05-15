import { createContext, useState, useContext, useEffect } from "react"
import { useMedication } from "./MedicationContext"
import { useEvents } from "./EventsContext"

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem("notifications")
    return savedNotifications ? JSON.parse(savedNotifications) : []
  })

  const [unreadCount, setUnreadCount] = useState(0)
  const [permission, setPermission] = useState("default")
  const { medications } = useMedication()
  const { events } = useEvents()

  // Salvar notificações no localStorage
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))

    // Atualizar contagem de não lidas
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)
  }, [notifications])

  // Verificar permissão de notificações
  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  // Verificar medicamentos e eventos para criar notificações
  useEffect(() => {
    checkMedicationReminders()
    checkEventReminders()

    // Configurar verificação periódica
    const interval = setInterval(() => {
      checkMedicationReminders()
      checkEventReminders()
    }, 60000) // Verificar a cada minuto

    return () => clearInterval(interval)
  }, [medications, events])

  // Solicitar permissão para notificações
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === "granted"
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error)
      return false
    }
  }

  // Verificar medicamentos para lembretes
  const checkMedicationReminders = () => {
    if (!medications || medications.length === 0) return

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`

    medications.forEach((medication) => {
      if (medication.status !== "active") return

      // Verificar se o medicamento deve ser tomado agora
      if (medication.time === currentTime) {
        // Criar notificação
        const notification = {
          id: Date.now().toString(),
          type: "medication",
          title: "Lembrete de Medicamento",
          message: `Hora de tomar ${medication.name} - ${medication.dosage}`,
          time: new Date().toISOString(),
          read: false,
          data: {
            medicationId: medication.id,
            medicationName: medication.name,
          },
        }

        // Adicionar à lista de notificações
        addNotification(notification)

        // Enviar notificação do navegador se permitido
        if (permission === "granted") {
          sendBrowserNotification(notification.title, notification.message)
        }
      }
    })
  }

  // Verificar eventos para lembretes
  const checkEventReminders = () => {
    if (!events || events.length === 0) return

    const now = new Date()
    const today = now.toISOString().split("T")[0]

    events.forEach((event) => {
      if (event.date !== today) return

      const eventTime = event.startTime
      const [eventHour, eventMinute] = eventTime.split(":").map(Number)

      // Calcular tempo para o evento (em minutos)
      const eventDate = new Date(event.date)
      eventDate.setHours(eventHour, eventMinute, 0, 0)

      const timeDiff = (eventDate.getTime() - now.getTime()) / (1000 * 60)

      // Notificar 30 minutos antes
      if (timeDiff > 29 && timeDiff < 31) {
        // Criar notificação
        const notification = {
          id: Date.now().toString(),
          type: "event",
          title: "Lembrete de Evento",
          message: `${event.title} começa em 30 minutos (${event.startTime})`,
          time: new Date().toISOString(),
          read: false,
          data: {
            eventId: event.id,
            eventTitle: event.title,
          },
        }

        // Adicionar à lista de notificações
        addNotification(notification)

        // Enviar notificação do navegador se permitido
        if (permission === "granted") {
          sendBrowserNotification(notification.title, notification.message)
        }
      }
    })
  }

  // Enviar notificação do navegador
  const sendBrowserNotification = (title, message) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return
    }

    try {
      new Notification(title, {
        body: message,
        icon: "/logo.png",
      })
    } catch (error) {
      console.error("Erro ao enviar notificação:", error)
    }
  }

  // Adicionar notificação
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev])
  }

  // Marcar notificação como lida
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Remover notificação
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Limpar todas as notificações
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Criar notificação manual
  const createNotification = (title, message, type = "info") => {
    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false,
    }

    addNotification(notification)

    if (permission === "granted") {
      sendBrowserNotification(title, message)
    }

    return notification.id
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        permission,
        requestPermission,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        createNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
