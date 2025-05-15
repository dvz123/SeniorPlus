import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "../contexts/UserContext"
import { useToast } from "../contexts/ToastContext"
import "../styles/AtualizarDados.css"

function AtualizarDados() {
  const { elderlyData, updateElderlyData } = useUser()
  const { showSuccess } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    age: "",
    bloodType: "",
    maritalStatus: "",
    address: "",
    phone: "",
    emergencyContact: "",
    allergies: [],
    medicalConditions: [],
  })
  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  useEffect(() => {
    if (elderlyData) {
      setFormData(elderlyData)
    }
  }, [elderlyData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim() !== "") {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy.trim()],
      })
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (index) => {
    const updatedAllergies = [...formData.allergies]
    updatedAllergies.splice(index, 1)
    setFormData({
      ...formData,
      allergies: updatedAllergies,
    })
  }

  const handleAddCondition = () => {
    if (newCondition.trim() !== "") {
      setFormData({
        ...formData,
        medicalConditions: [...formData.medicalConditions, newCondition.trim()],
      })
      setNewCondition("")
    }
  }

  const handleRemoveCondition = (index) => {
    const updatedConditions = [...formData.medicalConditions]
    updatedConditions.splice(index, 1)
    setFormData({
      ...formData,
      medicalConditions: updatedConditions,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateElderlyData(formData)
    showSuccess("Dados atualizados com sucesso!")
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
          <h1>Atualizar Dados do Idoso</h1>
          <p>Atualize as informações pessoais e médicas do paciente.</p>
        </div>

        <div className="update-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Informações Pessoais</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="id">ID</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Idade</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bloodType">Tipo Sanguíneo</label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType || ""}
                    onChange={handleChange}
                    required
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
                <div className="form-group">
                  <label htmlFor="maritalStatus">Estado Civil</label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Endereço</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContact">Contato de Emergência</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Informações Médicas</h2>

              <div className="form-subsection">
                <h3>Alergias</h3>
                <div className="tags-container">
                  {formData.allergies?.map((allergy, index) => (
                    <div key={index} className="tag">
                      {allergy}
                      <button type="button" className="remove-tag" onClick={() => handleRemoveAllergy(index)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-tag-container">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Adicionar alergia"
                  />
                  <button type="button" className="add-tag-button" onClick={handleAddAllergy}>
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="form-subsection">
                <h3>Condições Médicas</h3>
                <div className="tags-container">
                  {formData.medicalConditions?.map((condition, index) => (
                    <div key={index} className="tag">
                      {condition}
                      <button type="button" className="remove-tag" onClick={() => handleRemoveCondition(index)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-tag-container">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Adicionar condição médica"
                  />
                  <button type="button" className="add-tag-button" onClick={handleAddCondition}>
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-button">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AtualizarDados
