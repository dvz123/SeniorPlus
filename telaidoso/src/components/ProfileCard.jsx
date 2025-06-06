import { useState } from "react";
import "../styles/ProfileCard.css";

function ProfileCard() {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const newUser = {
      nome: "Lucas Ramos Coelho",
      id: 123,
      idade: 80,
      estadoCivil: "Divorciado(a)",
      tipoSanguineo: "A-",
      alergia: "nenhum"
    };
    setUser(newUser);
  };

  const getAvatar = () => {
    if (!user?.nome) return "--";
    return user.nome
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar">{getAvatar()}</div>
        <div className="profile-info">
          <strong>{user?.nome || "Nome"}</strong>
          <small>ID: #{user?.id || "--"}</small>
        </div>
      </div>

      <div className="grid">
        <div>
          <div className="label">Idade:</div>
          <div className="value">{user?.idade || "--"}</div>

          <div className="label">Estado civil:</div>
          <div className="value">{user?.estadoCivil || "--"}</div>
        </div>

        <div>
          <div className="label">Tipo sanguíneo:</div>
          <div className="value">{user?.tipoSanguineo || "--"}</div>

          <div className="label">Alergias:</div>
          <div className="value">
            <span className="allergy-tag">
              {user?.alergia || "--"}
            </span>
          </div>
        </div>
      </div>

      <button className="load-button" onClick={loadUser}>
        Carregar Dados
      </button>
    </div>
  );
}

export default ProfileCard;
