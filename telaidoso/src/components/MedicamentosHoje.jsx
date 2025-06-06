import React, { useState } from 'react';
import '../styles/MedicamentosHoje.css';
import { Pill } from 'lucide-react';

const medicamentosMock = [
  {
    id: 1,
    nome: 'Paracetamol',
    dosagem: '500mg',
    frequencia: '3x ao dia',
    horarios: ['07:00', '15:00', '23:00'],
  },
  {
    id: 2,
    nome: 'Amoxilina',
    dosagem: '350mg',
    frequencia: '1x ao dia',
    horarios: ['07:00'],
  },
];

const MedicamentosHoje = () => {
  const [medsTomados, setMedsTomados] = useState({});

  const toggleTomado = (medId, horario) => {
    setMedsTomados(prev => {
      const key = `${medId}-${horario}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  return (
    <div className="medicamentos-container">
      <div className="med-title">
        <Pill size={18} />
        <span>Medicamentos de Hoje</span>
      </div>

      <div className="medicamentos-body">
        {medicamentosMock.length === 0 ? (
          <div className="med-card">
            Nenhum medicamento para hoje.
          </div>
        ) : (
          medicamentosMock.map((med) => (
            <div className="med-card" key={med.id}>
              <div className="med-nome">
                <strong>{med.nome}</strong> - {med.dosagem}
              </div>
              <div className="med-frequencia">Frequência: {med.frequencia}</div>
              <div className="med-horarios">
                {med.horarios.map((hora, index) => {
                  const key = `${med.id}-${hora}`;
                  return (
                    <label key={index} className="custom-checkbox">
                      <span className="hora-texto">{hora}</span>
                      <input
                        type="checkbox"
                        checked={medsTomados[key] || false}
                        onChange={() => toggleTomado(med.id, hora)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicamentosHoje;
