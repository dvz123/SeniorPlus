import { useEffect, useState } from "react";
import "../styles/ProfileCard.css";

function ProfileCard() {
  const [elderlyData, setElderlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchElderlyData() {
      try {
        const token = localStorage.getItem("authToken"); // Certifique-se de que o token está salvo como 'token'
        if (!token) throw new Error("Token não encontrado no localStorage");

        const response = await fetch("http://localhost:8080/api/v1/idoso/informacoesIdoso", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados do idoso");
        }

        const data = await response.json();

        const birthDate = new Date(data.dataNascimento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthday = today.getMonth() > birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        const finalAge = hasHadBirthday ? age : age - 1;

        setElderlyData({
          id: data.cpf || "000",
          name: data.nome || "Sem nome",
          email: data.email,
          phone: data.telefone,
          photoUrl: "", // Adicione um campo se houver foto
          bloodType: data.tipoSanguineo,
          maritalStatus: data.estadoCivil || "Não informado",
          weight: data.peso,
          height: data.altura,
          birthDate: data.dataNascimento,
          observation: data.observacao,
          imc: data.imc,
          age: finalAge,
          allergies: data.alergias || "",
        });
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchElderlyData();
  }, []);

  if (loading) {
    return (
      <div className="profile-card loading">
        <div className="profile-header">
          <p>Carregando dados do idoso...</p>
        </div>
      </div>
    );
  }

  if (!elderlyData) {
    return (
      <div className="profile-card error">
        <div className="profile-header">
          <p>Cadastre os dados do idoso.</p>
        </div>
      </div>
    );
  }

  const allergiesList = Array.isArray(elderlyData.allergies)
    ? elderlyData.allergies
    : elderlyData.allergies?.split(",").map((item) => item.trim());

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {elderlyData.photoUrl ? (
            <img
              src={elderlyData.photoUrl}
              alt="Foto do idoso"
              onError={(e) => {
                e.target.style.display = "none";
                const fallback = e.target.parentNode.querySelector(".profile-avatar-fallback");
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}

          <div
            className="profile-avatar-fallback"
            style={{ display: elderlyData.photoUrl ? "none" : "flex" }}
          >
            {elderlyData.name
              ? elderlyData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
              : "ID"}
          </div>
        </div>

        <div>
          <h2 className="profile-name">{elderlyData.name || "Nome não informado"}</h2>
          <p className="profile-id">ID: #{elderlyData.id || "000"}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-grid">
          <div className="profile-item">
            <span className="profile-label">Idade:</span>
            <span className="profile-value">{elderlyData.age || "Não informada"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Tipo sanguíneo:</span>
            <span className="profile-value">{elderlyData.bloodType || "Não informado"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Estado civil:</span>
            <span className="profile-value">{elderlyData.maritalStatus || "Não informado"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Alergias:</span>
            {allergiesList && allergiesList.length > 0 ? (
              allergiesList.map((allergy, index) => (
                <span key={index} className="allergy-badge">
                  {allergy}
                </span>
              ))
            ) : (
              <span className="profile-value">Nenhuma</span>
            )}
          </div>
          <div className="profile-item">
            <span className="profile-label">IMC:</span>
            <span className="profile-value">{elderlyData.imc || "Não calculado"}</span>
          </div>
          <div className="profile-item">
            <span className="profile-label">Observações:</span>
            <span className="profile-value">{elderlyData.observation || "Nenhuma"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
