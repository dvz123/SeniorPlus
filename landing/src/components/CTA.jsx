import { ArrowRight } from "lucide-react"
import '../styles/globals.css'

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <h2 className="cta-title">Faça parte desta transformação</h2>
        <p className="cta-description">
          Conheça o Senior+ e descubra como a tecnologia pode promover autonomia e bem-estar para a terceira idade.
        </p>
        <div className="cta-buttons">
          <button className="btn btn-white btn-lg">
            Começar teste grátis
            <ArrowRight size={20} style={{ marginLeft: "0.5rem" }} />
          </button>
          <button className="btn btn-outline-white btn-lg">Conhecer o projeto</button>
        </div>
      </div>
    </section>
  )
}

export default CTA
