import { Calendar, Bell, Activity, BookOpen, AlertTriangle, Smartphone } from "lucide-react"
import '../styles/globals.css'

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Agendamento de Consultas",
      description:
        "Sistema intuitivo para marcar e gerenciar consultas médicas com lembretes automáticos e sincronização.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Bell,
      title: "Lembretes de Medicamentos",
      description: "Notificações inteligentes para administração de medicamentos com controle de dosagem e horários.",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: Activity,
      title: "Registro de Atividades",
      description: "Acompanhe atividades diárias, exercícios e rotinas para manter um estilo de vida ativo e saudável.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: BookOpen,
      title: "Conteúdos Educativos",
      description: "Acesso a vídeos, textos e materiais multimídia sobre saúde, bem-estar e autocuidado.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: AlertTriangle,
      title: "Suporte de Emergência",
      description: "Sistema de alertas e contatos de emergência para situações que requerem atenção imediata.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Smartphone,
      title: "Acesso Multiplataforma",
      description: "Disponível em smartphones, tablets e desktops com design responsivo e acessível.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <section id="funcionalidades" className="section">
      <div className="container">
        <h2 className="section-title-large">Funcionalidades Inteligentes</h2>
        <p className="section-description-large">
          Recursos desenvolvidos especificamente para promover autonomia e bem-estar da terceira idade
        </p>

        <div className="grid grid-3">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <div className="card-header">
                <div className={`feature-icon ${feature.bgColor}`}>
                  <feature.icon className={feature.color} size={24} />
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
