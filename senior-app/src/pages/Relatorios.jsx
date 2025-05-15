import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useEvents } from "../contexts/EventsContext"
import { useMedication } from "../contexts/MedicationContext"
import { useUser } from "../contexts/UserContext"
import { useToast } from "../contexts/ToastContext"
import "../styles/Relatorios.css"

function Relatorios() {
  const { events } = useEvents()
  const { medications = [], medicationHistory = [] } = useMedication()
  const { user } = useUser()
  const { showToast } = useToast()
  // const [setReportType] = useState("events")
  const [chartType, setChartType] = useState("bar")
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [activeTab, setActiveTab] = useState("eventos")
  const [isExporting, setIsExporting] = useState(false)

  // Chart references
  const categoryChartRef = useRef(null)
  const timelineChartRef = useRef(null)
  const medicationChartRef = useRef(null)
  const adherenceChartRef = useRef(null)

  // const handleReportTypeChange = (e) => {
  //   setReportType(e.target.value)
  // }

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value)
  }

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target
    setDateRange({
      ...dateRange,
      [name]: value,
    })
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  // Filter events by date range
  const filteredEvents = events
    ? events.filter((event) => {
        const eventDate = new Date(event.date)
        const startDate = new Date(dateRange.start)
        const endDate = new Date(dateRange.end)
        return eventDate >= startDate && eventDate <= endDate
      })
    : []

  // Group events by category
  const eventsByCategory = filteredEvents.reduce((acc, event) => {
    const category = event.category || "Outros"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(event)
    return acc
  }, {})

  // Calculate category statistics
  const categoryStats = Object.keys(eventsByCategory)
    .map((category) => ({
      category,
      count: eventsByCategory[category].length,
      percentage: Math.round((eventsByCategory[category].length / (filteredEvents.length || 1)) * 100) || 0,
    }))
    .sort((a, b) => b.count - a.count)

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const date = event.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  // Format date for chart labels
  const formatDateShort = (dateString) => {
    const options = { day: "2-digit", month: "2-digit" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  // Get dates between start and end date
  const getDatesInRange = (startDate, endDate) => {
    const dates = []
    const currentDate = new Date(startDate)
    const end = new Date(endDate)

    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  // Get event counts by date
  const getEventCountsByDate = () => {
    const dates = getDatesInRange(dateRange.start, dateRange.end)
    return dates.map((date) => {
      return {
        date,
        count: eventsByDate[date]?.length || 0,
      }
    })
  }

  // Calculate medication adherence
  const calculateMedicationAdherence = () => {
    if (!medicationHistory || medicationHistory.length === 0) return []

    const medications = {}

    medicationHistory.forEach((history) => {
      if (!history) return

      const historyDate = new Date(history.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)

      if (historyDate >= startDate && historyDate <= endDate) {
        if (!medications[history.medicationId]) {
          medications[history.medicationId] = {
            name: history.medicationName || `Medicamento ${history.medicationId}`,
            taken: 0,
            missed: 0,
          }
        }

        if (history.taken) {
          medications[history.medicationId].taken += 1
        } else {
          medications[history.medicationId].missed += 1
        }
      }
    })

    return Object.values(medications)
  }

  // Export data to CSV
  const exportToCSV = () => {
    setIsExporting(true)

    try {
      let csvContent = ""
      let filename = ""

      if (activeTab === "eventos") {
        // Header
        csvContent = "Data,Título,Categoria,Horário Início,Horário Fim,Local\n"

        // Data
        filteredEvents.forEach((event) => {
          csvContent += `${event.date},${event.title},${event.category},${event.startTime},${event.endTime},${event.location || ""}\n`
        })

        filename = `eventos_${user?.name || "idoso"}_${new Date().toISOString().split("T")[0]}.csv`
      } else {
        // Header
        csvContent = "Medicamento,Doses Tomadas,Doses Perdidas,Taxa de Adesão\n"

        // Data
        const adherenceData = calculateMedicationAdherence()
        adherenceData.forEach((med) => {
          const total = med.taken + med.missed
          const adherenceRate = total > 0 ? Math.round((med.taken / total) * 100) : 0
          csvContent += `${med.name},${med.taken},${med.missed},${adherenceRate}%\n`
        })

        filename = `medicamentos_${user?.name || "idoso"}_${new Date().toISOString().split("T")[0]}.csv`
      }

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showToast("Relatório exportado com sucesso!", "success")
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      showToast("Erro ao exportar relatório. Tente novamente.", "error")
    } finally {
      setIsExporting(false)
    }
  }

  // Render chart using canvas and JavaScript
  useEffect(() => {
    if (activeTab === "eventos") {
      renderEventCharts()
      
    } else if (activeTab === "medicamentos") {
      renderMedicationCharts()
    }// eslint-disable-next-line
  }, [activeTab, chartType, categoryStats, dateRange, medicationHistory])

  // Render event charts
  const renderEventCharts = () => {
    if (!categoryChartRef.current || !timelineChartRef.current) return

    // Clear previous charts
    const categoryCtx = categoryChartRef.current.getContext("2d")
    const timelineCtx = timelineChartRef.current.getContext("2d")
    categoryCtx.clearRect(0, 0, categoryChartRef.current.width, categoryChartRef.current.height)
    timelineCtx.clearRect(0, 0, timelineChartRef.current.width, timelineChartRef.current.height)

    // Render category chart
    if (chartType === "bar") {
      renderCategoryBarChart(categoryCtx)
    } else {
      renderCategoryPieChart(categoryCtx)
    }

    // Render timeline chart
    renderTimelineChart(timelineCtx)
  }

  // Render medication charts
  const renderMedicationCharts = () => {
    if (!medicationChartRef.current || !adherenceChartRef.current) return

    // Clear previous charts
    const medicationCtx = medicationChartRef.current.getContext("2d")
    const adherenceCtx = adherenceChartRef.current.getContext("2d")
    medicationCtx.clearRect(0, 0, medicationChartRef.current.width, medicationChartRef.current.height)
    adherenceCtx.clearRect(0, 0, adherenceChartRef.current.width, adherenceChartRef.current.height)

    // Render medication usage chart
    if (chartType === "bar") {
      renderMedicationBarChart(medicationCtx)
    } else {
      renderMedicationPieChart(medicationCtx)
    }

    // Render adherence chart
    renderAdherenceChart(adherenceCtx)
  }

  // Render category bar chart
  const renderCategoryBarChart = (ctx) => {
    if (categoryStats.length === 0) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const categoryLabels = categoryStats.map((stat) => stat.category)
    const categoryData = categoryStats.map((stat) => stat.count)
    const categoryColors = getCategoryColors(categoryLabels)

    const chartHeight = ctx.canvas.height
    const chartWidth = ctx.canvas.width
    const barWidth = chartWidth / (categoryLabels.length * 2)
    const maxValue = Math.max(...categoryData, 1)
    const barHeightRatio = (chartHeight - 60) / maxValue

    // Draw title
    ctx.font = "16px Arial"
    ctx.fillStyle = getTextColor()
    ctx.textAlign = "center"
    ctx.fillText("Eventos por Categoria", chartWidth / 2, 20)

    // Draw bars
    categoryLabels.forEach((label, index) => {
      const barHeight = categoryData[index] * barHeightRatio
      const x = index * (barWidth * 2) + barWidth / 2
      const y = chartHeight - barHeight - 30

      // Draw bar
      ctx.fillStyle = categoryColors[index]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw label
      ctx.fillStyle = getTextColor()
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(label, x + barWidth / 2, chartHeight - 10)

      // Draw value
      ctx.fillStyle = getTextColor()
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(categoryData[index], x + barWidth / 2, y - 5)
    })
  }

  // Render category pie chart
  const renderCategoryPieChart = (ctx) => {
    if (categoryStats.length === 0) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const categoryLabels = categoryStats.map((stat) => stat.category)
    const categoryData = categoryStats.map((stat) => stat.count)
    const categoryColors = getCategoryColors(categoryLabels)

    const chartHeight = ctx.canvas.height
    const chartWidth = ctx.canvas.width
    const radius = Math.min(chartWidth, chartHeight) / 2 - 40
    const centerX = chartWidth / 2
    const centerY = chartHeight / 2

    // Draw title
    ctx.font = "16px Arial"
    ctx.fillStyle = getTextColor()
    ctx.textAlign = "center"
    ctx.fillText("Distribuição por Categoria", centerX, 20)

    // Calculate total
    const total = categoryData.reduce((sum, value) => sum + value, 0)

    // Draw pie slices
    let startAngle = 0
    categoryData.forEach((value, index) => {
      const sliceAngle = (2 * Math.PI * value) / total

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = categoryColors[index]
      ctx.fill()

      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 1.2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
      ctx.lineTo(labelX, labelY)
      ctx.strokeStyle = getTextColor()
      ctx.stroke()

      // Draw label
      ctx.font = "12px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = midAngle < Math.PI ? "left" : "right"
      ctx.fillText(`${categoryLabels[index]} (${Math.round((value / total) * 100)}%)`, labelX, labelY)

      startAngle += sliceAngle
    })
  }

  // Render timeline chart
  const renderTimelineChart = (ctx) => {
    const eventCounts = getEventCountsByDate()

    if (eventCounts.every((item) => item.count === 0)) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const timelineLabels = eventCounts.map((item) => formatDateShort(item.date))
    const timelineData = eventCounts.map((item) => item.count)

    const chartHeight = ctx.canvas.height
    const chartWidth = ctx.canvas.width
    const maxValue = Math.max(...timelineData, 1)
    const pointSpacing = chartWidth / (timelineLabels.length + 1)
    const heightRatio = (chartHeight - 60) / maxValue

    // Draw title
    ctx.font = "16px Arial"
    ctx.fillStyle = getTextColor()
    ctx.textAlign = "center"
    ctx.fillText("Eventos por Dia", chartWidth / 2, 20)

    // Draw x and y axis
    ctx.beginPath()
    ctx.moveTo(30, 30)
    ctx.lineTo(30, chartHeight - 30)
    ctx.lineTo(chartWidth - 10, chartHeight - 30)
    ctx.strokeStyle = getTextColor()
    ctx.stroke()

    // Draw points and connect with line
    ctx.beginPath()
    timelineData.forEach((value, index) => {
      const x = (index + 1) * pointSpacing
      const y = chartHeight - 30 - value * heightRatio

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#0aa174"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()

      // Draw value
      if (value > 0) {
        ctx.fillStyle = getTextColor()
        ctx.font = "12px Arial"
        ctx.textAlign = "center"
        ctx.fillText(value, x, y - 10)
      }

      // Draw x-axis label (date)
      if (index % Math.ceil(timelineLabels.length / 10) === 0 || index === timelineLabels.length - 1) {
        ctx.fillStyle = getTextColor()
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(timelineLabels[index], x, chartHeight - 10)
      }
    })

    // Draw line connecting points
    ctx.strokeStyle = "#0aa174"
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Render medication bar chart
  const renderMedicationBarChart = (ctx) => {
    const medicationUsage = {}

    if (!medicationHistory || medicationHistory.length === 0) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados de medicamentos para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    medicationHistory.forEach((history) => {
      if (!history) return

      const historyDate = new Date(history.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)

      if (historyDate >= startDate && historyDate <= endDate && history.taken) {
        const medName = history.medicationName || `Medicamento ${history.medicationId}`
        if (!medicationUsage[medName]) {
          medicationUsage[medName] = 0
        }
        medicationUsage[medName] += 1
      }
    })

    const medicationLabels = Object.keys(medicationUsage)

    if (medicationLabels.length === 0) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados de medicamentos para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const medicationData = Object.values(medicationUsage)
    const medicationColors = getMedicationColors(medicationLabels)

    const chartHeight = ctx.canvas.height
    const chartWidth = ctx.canvas.width
    const barWidth = chartWidth / (medicationLabels.length * 2)
    const maxValue = Math.max(...medicationData, 1)
    const barHeightRatio = (chartHeight - 60) / maxValue

    // Draw title
    ctx.font = "16px Arial"
    ctx.fillStyle = getTextColor()
    ctx.textAlign = "center"
    ctx.fillText("Uso de Medicamentos", chartWidth / 2, 20)

    // Draw bars
    medicationLabels.forEach((label, index) => {
      const barHeight = medicationData[index] * barHeightRatio
      const x = index * (barWidth * 2) + barWidth / 2
      const y = chartHeight - barHeight - 30

      // Draw bar
      ctx.fillStyle = medicationColors[index]
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw label (truncate if too long)
      ctx.fillStyle = getTextColor()
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      const truncatedLabel = label.length > 10 ? label.substring(0, 8) + "..." : label
      ctx.fillText(truncatedLabel, x + barWidth / 2, chartHeight - 10)

      // Draw value
      ctx.fillStyle = getTextColor()
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(medicationData[index], x + barWidth / 2, y - 5)
    })
  }

  // Render medication pie chart
  const renderMedicationPieChart = (ctx) => {
    const medicationUsage = {}

    if (!medicationHistory || medicationHistory.length === 0) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados de medicamentos para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    medicationHistory.forEach((history) => {
      if (!history) return

      const historyDate = new Date(history.date)
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)

      if (historyDate >= startDate && historyDate <= endDate && history.taken) {
        const medName = history.medicationName || `Medicamento ${history.medicationId}`
        if (!medicationUsage[medName]) {
          medicationUsage[medName] = 0
        }
        medicationUsage[medName] += 1
      }
    })

    const medicationLabels = Object.keys(medicationUsage)

    if (medicationLabels.length === 0) {
      // No data to display
      ctx.font = "16px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados de medicamentos para exibir", ctx.canvas.width / 2, ctx.canvas.height / 2)
      return
    }

    const medicationData = Object.values(medicationUsage)
    const medicationColors = getMedicationColors(medicationLabels)

    const chartHeight = ctx.canvas.height
    const chartWidth = ctx.canvas.width
    const radius = Math.min(chartWidth, chartHeight) / 2 - 40
    const centerX = chartWidth / 2
    const centerY = chartHeight / 2

    // Draw title
    ctx.font = "16px Arial"
    ctx.fillStyle = getTextColor()
    ctx.textAlign = "center"
    ctx.fillText("Distribuição de Medicamentos", centerX, 20)

    // Calculate total
    const total = medicationData.reduce((sum, value) => sum + value, 0)

    // Draw pie slices
    let startAngle = 0
    medicationData.forEach((value, index) => {
      const sliceAngle = (2 * Math.PI * value) / total

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = medicationColors[index]
      ctx.fill()

      // Draw label line and text
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 1.2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      ctx.beginPath()
      ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius)
      ctx.lineTo(labelX, labelY)
      ctx.strokeStyle = getTextColor()
      ctx.stroke()

      // Draw label
      ctx.font = "12px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = midAngle < Math.PI ? "left" : "right"
      const truncatedLabel =
        medicationLabels[index].length > 10 ? medicationLabels[index].substring(0, 8) + "..." : medicationLabels[index]
      ctx.fillText(`${truncatedLabel} (${Math.round((value / total) * 100)}%)`, labelX, labelY)

      startAngle += sliceAngle
    })
  }

  // Render adherence chart
  const renderAdherenceChart = (ctx) => {
    const adherenceData = calculateMedicationAdherence()

    const chartHeight = ctx.canvas.height
    const chartWidth = ctx.canvas.width

    // Draw title
    ctx.font = "16px Arial"
    ctx.fillStyle = getTextColor()
    ctx.textAlign = "center"
    ctx.fillText("Adesão aos Medicamentos", chartWidth / 2, 20)

    if (!adherenceData || adherenceData.length === 0) {
      ctx.font = "14px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "center"
      ctx.fillText("Sem dados de adesão para o período selecionado", chartWidth / 2, chartHeight / 2)
      return
    }

    const barHeight = 30
    const barSpacing = 15
    const startY = 50
    const maxLabelWidth = 100
    const barStartX = maxLabelWidth + 20
    const barMaxWidth = chartWidth - barStartX - 50

    adherenceData.forEach((med, index) => {
      const y = startY + index * (barHeight + barSpacing)
      const total = med.taken + med.missed
      const adherenceRate = total > 0 ? med.taken / total : 0

      // Draw medication name
      ctx.font = "12px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "right"
      const truncatedName = med.name.length > 15 ? med.name.substring(0, 12) + "..." : med.name
      ctx.fillText(truncatedName, barStartX - 10, y + barHeight / 2 + 4)

      // Draw background bar
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(barStartX, y, barMaxWidth, barHeight)

      // Draw adherence bar
      const adherenceWidth = barMaxWidth * adherenceRate
      ctx.fillStyle = getAdherenceColor(adherenceRate)
      ctx.fillRect(barStartX, y, adherenceWidth, barHeight)

      // Draw adherence percentage
      ctx.font = "12px Arial"
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      if (adherenceWidth > 40) {
        ctx.fillText(`${Math.round(adherenceRate * 100)}%`, barStartX + adherenceWidth / 2, y + barHeight / 2 + 4)
      } else {
        ctx.fillStyle = getTextColor()
        ctx.textAlign = "left"
        ctx.fillText(`${Math.round(adherenceRate * 100)}%`, barStartX + adherenceWidth + 5, y + barHeight / 2 + 4)
      }

      // Draw taken/missed counts
      ctx.font = "12px Arial"
      ctx.fillStyle = getTextColor()
      ctx.textAlign = "left"
      ctx.fillText(`${med.taken}/${total}`, barStartX + barMaxWidth + 10, y + barHeight / 2 + 4)
    })
  }

  // Helper functions for charts
  const getCategoryColors = (categories) => {
    const colorMap = {
      atividade: "#0aa174",
      consulta: "#3b82f6",
      social: "#8b5cf6",
      medicação: "#ef4444",
      outros: "#64748b",
    }

    return categories.map((category) => colorMap[category.toLowerCase()] || "#64748b")
  }

  const getMedicationColors = (medications) => {
    const colors = [
      "#0aa174",
      "#3b82f6",
      "#8b5cf6",
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#6366f1",
      "#ec4899",
      "#14b8a6",
      "#f43f5e",
    ]

    return medications.map((_, index) => colors[index % colors.length])
  }

  const getAdherenceColor = (rate) => {
    if (rate >= 0.8) return "#0aa174"
    if (rate >= 0.5) return "#f59e0b"
    return "#ef4444"
  }

  const getTextColor = () => {
    // Check if dark mode is active by looking at body class
    const isDarkMode = document.body.classList.contains("dark-mode")
    return isDarkMode ? "#e5e7eb" : "#1f2937"
  }

  // Safely get counts for medication history
  const getTakenCount = () => {
    if (!medicationHistory) return 0
    return medicationHistory.filter(
      (h) =>
        h && new Date(h.date) >= new Date(dateRange.start) && new Date(h.date) <= new Date(dateRange.end) && h.taken,
    ).length
  }

  const getMissedCount = () => {
    if (!medicationHistory) return 0
    return medicationHistory.filter(
      (h) =>
        h && new Date(h.date) >= new Date(dateRange.start) && new Date(h.date) <= new Date(dateRange.end) && !h.taken,
    ).length
  }

  return (
    <div className="container">
      <main className="main">
        <Link to="/" className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Voltar
        </Link>

        <div className="page-header">
          <h1>Relatórios do Idoso</h1>
          <p>Visualize e analise os dados de atividades, eventos e medicamentos do idoso sob seus cuidados.</p>
          {user && (
            <div className="patient-info">
              <span className="patient-name">Paciente: {user.name}</span>
              <span className="patient-age">Idade: {user.age} anos</span>
            </div>
          )}
        </div>

        <div className="report-tabs">
          <button
            className={`tab-button ${activeTab === "eventos" ? "active" : ""}`}
            onClick={() => handleTabChange("eventos")}
          >
            Eventos e Atividades
          </button>
          <button
            className={`tab-button ${activeTab === "medicamentos" ? "active" : ""}`}
            onClick={() => handleTabChange("medicamentos")}
          >
            Medicamentos
          </button>
        </div>

        <div className="report-controls">
          <div className="report-filters">
            <div className="filter-group">
              <label htmlFor="dateStart">De:</label>
              <input type="date" id="dateStart" name="start" value={dateRange.start} onChange={handleDateRangeChange} />
            </div>
            <div className="filter-group">
              <label htmlFor="dateEnd">Até:</label>
              <input type="date" id="dateEnd" name="end" value={dateRange.end} onChange={handleDateRangeChange} />
            </div>
            <div className="filter-group">
              <label htmlFor="chartType">Tipo de Gráfico:</label>
              <select id="chartType" value={chartType} onChange={handleChartTypeChange}>
                <option value="bar">Barras</option>
                <option value="pie">Pizza/Donut</option>
              </select>
            </div>
            <button className="export-button" onClick={exportToCSV} disabled={isExporting}>
              {isExporting ? "Exportando..." : "Exportar CSV"}
            </button>
          </div>
        </div>

        {activeTab === "eventos" && (
          <>
            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-value">{filteredEvents.length}</div>
                <div className="summary-label">Total de Eventos</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{Object.keys(eventsByDate).length}</div>
                <div className="summary-label">Dias com Atividades</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{Object.keys(eventsByCategory).length}</div>
                <div className="summary-label">Categorias</div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-card">
                <h2>Distribuição por Categoria</h2>
                <div className="chart-container">
                  <canvas ref={categoryChartRef} width="400" height="300"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <h2>Linha do Tempo de Eventos</h2>
                <div className="chart-container">
                  <canvas ref={timelineChartRef} width="400" height="300"></canvas>
                </div>
              </div>
            </div>

            <div className="report-content">
              <h2>Eventos por Data</h2>

              {Object.keys(eventsByDate).length === 0 ? (
                <div className="no-data">
                  <p>Nenhum evento encontrado para o período selecionado.</p>
                </div>
              ) : (
                <div className="date-events">
                  {Object.keys(eventsByDate)
                    .sort((a, b) => new Date(b) - new Date(a))
                    .map((date) => (
                      <div key={date} className="date-section">
                        <h3>{formatDate(date)}</h3>
                        <div className="date-events-list">
                          {eventsByDate[date]
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map((event) => (
                              <div key={event.id} className="event-card-small">
                                <div
                                  className={`event-category-small ${(event.category || "outros").toLowerCase()}`}
                                ></div>
                                <div className="event-details-small">
                                  <h4>{event.title}</h4>
                                  <p className="event-time-small">
                                    {event.startTime} - {event.endTime}
                                  </p>
                                  {event.location && <p className="event-location-small">{event.location}</p>}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "medicamentos" && (
          <>
            <div className="report-summary">
              <div className="summary-card">
                <div className="summary-value">{medications ? medications.length : 0}</div>
                <div className="summary-label">Total de Medicamentos</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{getTakenCount()}</div>
                <div className="summary-label">Doses Tomadas</div>
              </div>
              <div className="summary-card">
                <div className="summary-value">{getMissedCount()}</div>
                <div className="summary-label">Doses Perdidas</div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-card">
                <h2>Uso de Medicamentos</h2>
                <div className="chart-container">
                  <canvas ref={medicationChartRef} width="400" height="300"></canvas>
                </div>
              </div>

              <div className="chart-card">
                <h2>Adesão aos Medicamentos</h2>
                <div className="chart-container">
                  <canvas ref={adherenceChartRef} width="400" height="300"></canvas>
                </div>
              </div>
            </div>

            <div className="report-content">
              <h2>Detalhes de Adesão aos Medicamentos</h2>

              {calculateMedicationAdherence().length === 0 ? (
                <div className="no-data">
                  <p>Nenhum registro de medicamento encontrado para o período selecionado.</p>
                </div>
              ) : (
                <div className="medication-adherence-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Medicamento</th>
                        <th>Doses Tomadas</th>
                        <th>Doses Perdidas</th>
                        <th>Taxa de Adesão</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateMedicationAdherence().map((med, index) => {
                        const total = med.taken + med.missed
                        const adherenceRate = total > 0 ? Math.round((med.taken / total) * 100) : 0
                        return (
                          <tr key={index}>
                            <td>{med.name}</td>
                            <td>{med.taken}</td>
                            <td>{med.missed}</td>
                            <td>
                              <div className="adherence-bar-container">
                                <div
                                  className="adherence-bar"
                                  style={{
                                    width: `${adherenceRate}%`,
                                    backgroundColor:
                                      adherenceRate >= 80 ? "#0aa174" : adherenceRate >= 50 ? "#f59e0b" : "#ef4444",
                                  }}
                                ></div>
                                <span>{adherenceRate}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Relatorios
