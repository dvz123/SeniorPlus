import React, { useState } from 'react';
import '../styles/CalendarioAgenda.css';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isSameMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const eventos = [
  { data: new Date(2025, 5, 2, 10, 0), descricao: 'Consulta com Dr. Cardoso', tipo: 'Médico' },
  { data: new Date(2025, 5, 5, 15, 0), descricao: 'Aniversário da Maria (neta)', tipo: 'Família' },
  { data: new Date(2025, 5, 10, 9, 30), descricao: 'Exame de sangue - Lab Central', tipo: 'Exame' },
  { data: new Date(2025, 5, 15, 13, 0), descricao: 'Reunião com fisioterapeuta', tipo: 'Médico' },
  { data: new Date(2025, 5, 18, 18, 0), descricao: 'Churrasco da família', tipo: 'Família' },
  { data: new Date(2025, 5, 20, 8, 0), descricao: 'Jejum para exames', tipo: 'Exame' },
  { data: new Date(2025, 5, 22, 11, 0), descricao: 'Vacina de reforço', tipo: 'Médico' },
  { data: new Date(2025, 5, 25, 16, 0), descricao: 'Visita dos filhos', tipo: 'Família' },
  { data: new Date(2025, 5, 28, 10, 0), descricao: 'Check-up anual', tipo: 'Médico' },
  { data: new Date(2025, 5, 30, 14, 0), descricao: 'Ultrassom abdominal', tipo: 'Exame' },
];

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const CalendarioAgenda = () => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);

  const alterarMes = (direcao: 'anterior' | 'proximo') => {
    const novoMes = direcao === 'anterior' ? subMonths(mesAtual, 1) : addMonths(mesAtual, 1);
    setMesAtual(novoMes);
    setDiaSelecionado(null);
  };

  const inicioMes = startOfMonth(mesAtual);
  const fimMes = endOfMonth(mesAtual);
  const inicioSemana = startOfWeek(inicioMes, { weekStartsOn: 0 });
  const fimSemana = endOfWeek(fimMes, { weekStartsOn: 0 });

  const dias: Date[] = [];
  let dia = inicioSemana;
  while (dia <= fimSemana) {
    dias.push(dia);
    dia = addDays(dia, 1);
  }

  const eventosDoDia = (data: Date) =>
    eventos.filter((evento) => isSameDay(evento.data, data));

  const eventosDoMes = eventos.filter(
    (evento) =>
      evento.data.getMonth() === mesAtual.getMonth() &&
      evento.data.getFullYear() === mesAtual.getFullYear()
  );

  return (
    <div className="calendario-container">
      <div className="cabecalho-calendario">
        <CalendarDays size={20} />
        <h2>Calendário e Agenda</h2>
      </div>

      <div className="calendario-box">
        <div className="calendario-topo">
          <button onClick={() => alterarMes('anterior')} className="btn-mes"><ChevronLeft /></button>
          <h3>{format(mesAtual, 'MMMM yyyy', { locale: ptBR })}</h3>
          <button onClick={() => alterarMes('proximo')} className="btn-mes"><ChevronRight /></button>
        </div>

        <div className="calendario-grid">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
            <div key={dia} className="calendario-dia-titulo">{dia}</div>
          ))}

          {dias.map((data, index) => {
            const eventosHoje = eventosDoDia(data);
            return (
              <div
                key={index}
                className={`calendario-dia ${!isSameMonth(data, mesAtual) ? 'fora-do-mes' : ''}
                ${isSameDay(data, diaSelecionado ?? new Date(0)) ? 'dia-selecionado' : ''}`}
                onClick={() => setDiaSelecionado(data)}
              >
                <span>{format(data, 'd')}</span>
                {eventosHoje.length > 0 && <span className="marcador-evento" />}
              </div>
            );
          })}
        </div>

        {/* Eventos do dia selecionado */}
        {diaSelecionado && (
          <div className="eventos-lista">
            <h4>Eventos em {format(diaSelecionado, 'dd/MM/yyyy')}</h4>
            <div className="eventos-scroll">
              {eventosDoDia(diaSelecionado).length > 0 ? (
                eventosDoDia(diaSelecionado).map((evento, index) => (
                  <div key={index} className={`evento-card tipo-${evento.tipo.toLowerCase()}`}>
                    <div className="evento-data">
                      <strong>{format(evento.data, 'dd/MM - HH:mm')}</strong>
                    </div>
                    <div className="evento-descricao">{evento.descricao}</div>
                    <span className="evento-tipo">{evento.tipo}</span>
                  </div>
                ))
              ) : (
                <p>Sem eventos para este dia.</p>
              )}
            </div>
          </div>
        )}

        {/* Eventos do mês */}
        <div className="eventos-lista">
          <h4>Eventos do mês</h4>
          <div className="eventos-scroll">
            {eventosDoMes.length > 0 ? (
              eventosDoMes.map((evento, index) => (
                <div key={index} className={`evento-card tipo-${evento.tipo.toLowerCase()}`}>
                  <div className="evento-data">
                    <strong>{format(evento.data, 'dd/MM - HH:mm')}</strong>
                  </div>
                  <div className="evento-descricao">{evento.descricao}</div>
                  <span className="evento-tipo">{evento.tipo}</span>
                </div>
              ))
            ) : (
              <p>Sem eventos neste mês.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CalendarioAgenda;
