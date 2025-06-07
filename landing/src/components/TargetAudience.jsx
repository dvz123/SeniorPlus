import { Users, Heart, Shield, CheckCircle } from "lucide-react"
import '../styles/globals.css'

const TargetAudience = () => {
  const audiences = [
    {
      icon: Users,
      title: "Idosos",
      description:
        "Interface acessível com botões grandes, fontes ampliadas e alto contraste para facilitar o uso diário.",
      color: "bg-blue-500",
      features: ["Design inclusivo", "Navegação simplificada", "Conteúdo educativo"],
    },
    {
      icon: Heart,
      title: "Familiares",
      description: "Acompanhe seus entes queridos à distância com relatórios e notificações importantes.",
      color: "bg-teal-500",
      features: ["Monitoramento remoto", "Relatórios detalhados", "Alertas em tempo real"],
    },
    {
      icon: Shield,
      title: "Cuidadores",
      description: "Ferramentas profissionais para organizar rotinas e manter registros precisos.",
      color: "bg-purple-500",
      features: ["Gestão de rotinas", "Histórico completo", "Comunicação integrada"],
    },
  ]

  return (
    <section className="section section-alt">
      <div className="container">
        <h2 className="section-title-large">Para quem desenvolvemos</h2>
        <p className="section-description-large">
          Nossa plataforma conecta todos os envolvidos no cuidado, promovendo autonomia e bem-estar
        </p>

        <div className="grid grid-3">
          {audiences.map((item, index) => (
            <div key={index} className="card">
              <div className="card-header" style={{ textAlign: "center", paddingBottom: "1rem" }}>
                <div
                  className={`feature-icon ${item.color}`}
                  style={{ margin: "0 auto 1rem", width: "4rem", height: "4rem", borderRadius: "1rem" }}
                >
                  <item.icon size={32} color="white" />
                </div>
                <h3 className="card-title" style={{ fontSize: "1.5rem" }}>
                  {item.title}
                </h3>
                <p className="card-description">{item.description}</p>
              </div>
              <div className="card-content">
                <ul className="feature-list">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <CheckCircle size={16} className="check-icon" />
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TargetAudience
