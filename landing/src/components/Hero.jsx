import '../styles/globals.css'
import { ArrowRight, Heart, Play } from "lucide-react"

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Content */}
          <div className="hero-content">
            <div>
              <span className="badge">🎉 Teste grátis por 7 dias</span>

              <h1 className="hero-title" style={{ marginTop: "1.5rem" }}>
                Autonomia e bem-estar para{" "}
                <span className="hero-title-highlight">
                  a terceira idade
                  <div className="hero-title-underline"></div>
                </span>
              </h1>

              <p className="hero-description" style={{ marginTop: "1.5rem" }}>
                Uma plataforma digital integral que promove a independência dos idosos através de tecnologia acessível e
                funcionalidades inteligentes.
              </p>
            </div>

            <div className="hero-buttons">
              <a href="http://localhost:3000/registrar">
                <button className="btn btn-primary btn-lg">
                  Começar agora
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </a>
              <button className="btn btn-outline btn-lg">
                <Play className="mr-2" size={20} />
                Ver demonstração
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
