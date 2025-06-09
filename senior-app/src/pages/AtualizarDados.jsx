import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/AtualizarDados.css"

function AtualizarDados() {
  const [formData, setFormData] = useState({
    cpf: "",
    rg: "",
    nome: "",
    email: "",
    dataNascimento: "",
    telefone: "",
    peso: "",
    altura: "",
    tipoSanguineo: "",
    observacao: "",
    imc: null,
  })

  const [mensagem, setMensagem] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calcularIMC = (peso, altura) => {
    const p = parseFloat(peso)
    const a = parseFloat(altura)
    if (p && a) return (p / (a * a)).toFixed(2)
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dados = {
      ...formData,
      peso: parseFloat(formData.peso),
      altura: parseFloat(formData.altura),
      imc: calcularIMC(formData.peso, formData.altura),
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/idoso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("authToken"), // substitua com token real
        },
        body: JSON.stringify(dados),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar dados")
      }

      setMensagem("Dados atualizados com sucesso!")
    } catch (error) {
      setMensagem("Erro ao atualizar dados.")
      console.error(error)
    }
  }

  return (
    <div className="container">
      <main className="main">
        <Link to="/" className="back-button">
          ← Voltar
        </Link>

        <div className="page-header">
          <h1>Atualizar Dados do Idoso</h1>
          <p>Preencha os campos abaixo com as informações do paciente.</p>
        </div>

        <form className="update-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="rg">RG</label>
              <input
                type="text"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="peso">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="altura">Altura (m)</label>
              <input
                type="number"
                step="0.01"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipoSanguineo">Tipo Sanguíneo</label>
              <select
                name="tipoSanguineo"
                value={formData.tipoSanguineo}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="observacao">Observações</label>
              <textarea
                name="observacao"
                rows="3"
                value={formData.observacao}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Salvar Alterações
            </button>
          </div>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </main>
    </div>
  )
}

export default AtualizarDados
