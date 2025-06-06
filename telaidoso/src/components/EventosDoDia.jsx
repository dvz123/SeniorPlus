import React, { useState } from 'react';
import '../styles/EventosDoDia.css';
import { Calendar } from 'lucide-react';

const EventosDoDia = () => {
  const [eventos, setEventos] = useState([
    { hora: '09:00', descricao: 'Café da manhã', status: 'Concluído' },
    { hora: '14:00', descricao: 'Consulta médica - Dr. Silva', status: 'Pendente' },
    { hora: '18:00', descricao: 'Caminhada no parque', status: 'Pendente' },
  ]);

  const alternarStatus = (index) => {
    setEventos((prevEventos) =>
      prevEventos.map((evento, i) =>
        i === index
          ? {
              ...evento,
              status: evento.status === 'Concluído' ? 'Pendente' : 'Concluído',
            }
          : evento
      )
    );
  };

  return (
    <div className="eventos-container">
      <div className="eventos-header">
        <Calendar size={18} />
        <span>Eventos do dia</span>
      </div>

      <div className="eventos-body">
        {eventos.map((evento, index) => (
          <div
            key={index}
            className={`evento-card1 ${evento.status === 'Concluído' ? 'concluido' : 'pendente'}`}
            onClick={() => alternarStatus(index)}
          >
            <div className="evento-hora">{evento.hora}</div>
            <div className="evento-descricao">{evento.descricao}</div>
            <div className="evento-status">
              <span>{evento.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventosDoDia;
