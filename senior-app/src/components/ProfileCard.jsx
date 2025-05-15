import { useUser } from "../contexts/UserContext";
import "../styles/ProfileCard.css";

function ProfileCard() {
  const { elderlyData } = useUser();

  if (!elderlyData) {
    return (
      <div className="profile-card loading">
        <div className="profile-header">
          <p>Carregando dados do idoso...</p>
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
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
