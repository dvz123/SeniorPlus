import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { useToast } from "../contexts/ToastContext"
import "../styles/Configuracoes.css"

function Configuracoes() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { showSuccess } = useToast()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [reminderTime, setReminderTime] = useState("30")
  const [language, setLanguage] = useState("pt-BR")
  const [fontSize, setFontSize] = useState("medium")
  const [dataBackup, setDataBackup] = useState({
    lastBackup: "Nunca",
    autoBackup: false,
    backupFrequency: "weekly",
  })

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled)
  }

  const handleReminderTimeChange = (e) => {
    setReminderTime(e.target.value)
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value)
  }

  const handleAutoBackupToggle = () => {
    setDataBackup({
      ...dataBackup,
      autoBackup: !dataBackup.autoBackup,
    })
  }

  const handleBackupFrequencyChange = (e) => {
    setDataBackup({
      ...dataBackup,
      backupFrequency: e.target.value,
    })
  }

  const handleBackupNow = () => {
    const now = new Date()
    const formattedDate = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    setDataBackup({
      ...dataBackup,
      lastBackup: formattedDate,
    })

    showSuccess("Backup realizado com sucesso!")
  }

  const handleExportData = () => {
    // Simulação de exportação de dados
    showSuccess("Dados exportados com sucesso!")
  }

  const handleSaveSettings = () => {
    showSuccess("Configurações salvas com sucesso!")
  }

  const handleClearData = () => {
    // Simulação de limpeza de dados
    showSuccess("Dados limpos com sucesso!")
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
          <h1>Configurações</h1>
          <p>Personalize o sistema de acordo com suas preferências.</p>
        </div>

        <div className="settings-container">
          <div className="settings-section">
            <h2>Aparência</h2>

            <div className="settings-card">

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Tela do Paciente</div>
                  <div className="settings-option-description">
                    Veja como o idoso visualiza o sistema, com informações simplificadas e acessíveis.
                  </div>
                </div>
                <div className="settings-option-control">
                  <a href="http://localhost:3001">
                    <button className="settings-button" onClick={handleExportData}>
                      Tela do Paciente
                    </button>
                  </a>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Modo Escuro</div>
                  <div className="settings-option-description">
                    Ative o modo escuro para reduzir o cansaço visual em ambientes com pouca luz.
                  </div>
                </div>
                <div className="toggle-switch-container">
                  <button
                    className={`toggle-switch ${darkMode ? "active" : ""}`}
                    onClick={toggleDarkMode}
                    aria-label="Alternar modo escuro"
                  >
                    <span className="toggle-switch-slider"></span>
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Tamanho da Fonte</div>
                  <div className="settings-option-description">
                    Ajuste o tamanho da fonte para melhorar a legibilidade.
                  </div>
                </div>
                <div className="settings-option-control">
                  <select
                    className="settings-select"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    aria-label="Selecionar tamanho da fonte"
                  >
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                    <option value="x-large">Extra Grande</option>
                  </select>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Idioma</div>
                  <div className="settings-option-description">Selecione o idioma do sistema.</div>
                </div>
                <div className="settings-option-control">
                  <select
                    className="settings-select"
                    value={language}
                    onChange={handleLanguageChange}
                    aria-label="Selecionar idioma"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Notificações</h2>
            <div className="settings-card">
              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Notificações</div>
                  <div className="settings-option-description">
                    Receba notificações sobre medicamentos, eventos e lembretes.
                  </div>
                </div>
                <div className="toggle-switch-container">
                  <button
                    className={`toggle-switch ${notificationsEnabled ? "active" : ""}`}
                    onClick={handleNotificationsToggle}
                    aria-label="Alternar notificações"
                  >
                    <span className="toggle-switch-slider"></span>
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Sons</div>
                  <div className="settings-option-description">Ative sons para alertas e notificações.</div>
                </div>
                <div className="toggle-switch-container">
                  <button
                    className={`toggle-switch ${soundEnabled ? "active" : ""}`}
                    onClick={handleSoundToggle}
                    aria-label="Alternar sons"
                  >
                    <span className="toggle-switch-slider"></span>
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Tempo de Lembrete</div>
                  <div className="settings-option-description">
                    Defina com quanto tempo de antecedência deseja receber lembretes.
                  </div>
                </div>
                <div className="settings-option-control">
                  <select
                    className="settings-select"
                    value={reminderTime}
                    onChange={handleReminderTimeChange}
                    aria-label="Selecionar tempo de lembrete"
                  >
                    <option value="15">15 minutos antes</option>
                    <option value="30">30 minutos antes</option>
                    <option value="60">1 hora antes</option>
                    <option value="120">2 horas antes</option>
                    <option value="1440">1 dia antes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Dados e Privacidade</h2>
            <div className="settings-card">
              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Backup Automático</div>
                  <div className="settings-option-description">
                    Realize backups automáticos dos seus dados para evitar perdas.
                  </div>
                </div>
                <div className="toggle-switch-container">
                  <button
                    className={`toggle-switch ${dataBackup.autoBackup ? "active" : ""}`}
                    onClick={handleAutoBackupToggle}
                    aria-label="Alternar backup automático"
                  >
                    <span className="toggle-switch-slider"></span>
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Frequência de Backup</div>
                  <div className="settings-option-description">
                    Defina com que frequência os backups automáticos serão realizados.
                  </div>
                </div>
                <div className="settings-option-control">
                  <select
                    className="settings-select"
                    value={dataBackup.backupFrequency}
                    onChange={handleBackupFrequencyChange}
                    aria-label="Selecionar frequência de backup"
                    disabled={!dataBackup.autoBackup}
                  >
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensalmente</option>
                  </select>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Último Backup</div>
                  <div className="settings-option-description">
                    {dataBackup.lastBackup === "Nunca"
                      ? "Nenhum backup realizado ainda."
                      : `Último backup realizado em ${dataBackup.lastBackup}.`}
                  </div>
                </div>
                <div className="settings-option-control">
                  <button className="settings-button" onClick={handleBackupNow}>
                    Fazer Backup Agora
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Exportar Dados</div>
                  <div className="settings-option-description">
                    Exporte todos os dados para um arquivo que pode ser importado posteriormente.
                  </div>
                </div>
                <div className="settings-option-control">
                  <button className="settings-button" onClick={handleExportData}>
                    Exportar
                  </button>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Limpar Dados</div>
                  <div className="settings-option-description">
                    Remova todos os dados do sistema. Esta ação não pode ser desfeita.
                  </div>
                </div>
                <div className="settings-option-control">
                  <button className="settings-button danger" onClick={handleClearData}>
                    Limpar Dados
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Sobre o Sistema</h2>
            <div className="settings-card">
              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Versão</div>
                  <div className="settings-option-description">Senior+ v1.0.0</div>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Desenvolvido por</div>
                  <div className="settings-option-description">Equipe Senior+</div>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Contato</div>
                  <div className="settings-option-description">suporte@seniorplus.com.br</div>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Termos de Uso</div>
                  <div className="settings-option-description">
                    <a href="none" className="settings-link">
                      Visualizar Termos de Uso
                    </a>
                  </div>
                </div>
              </div>

              <div className="settings-option">
                <div className="settings-option-info">
                  <div className="settings-option-label">Política de Privacidade</div>
                  <div className="settings-option-description">
                    <a href="none" className="settings-link">
                      Visualizar Política de Privacidade
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="settings-button" onClick={handleSaveSettings}>
              Salvar Configurações
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Configuracoes
