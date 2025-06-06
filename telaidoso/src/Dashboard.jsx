import React from 'react';
import './styles/Dashboard.css';
import MedicamentosHoje from './components/MedicamentosHoje';
import PainelPrincipal from './components/PainelPrincipal.tsx';
import EventosDoDia from './components/EventosDoDia';
import CalendarioAgenda from './components/CalendarioAgenda.tsx';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="columns-container">
        <div className="left-column">
          <PainelPrincipal />
        </div>

        <div className="right-column">
          <EventosDoDia />
          <MedicamentosHoje />
        </div>
      </div>

      <div className="calendario-section">
        <CalendarioAgenda />
      </div>
    </div>
  );
};

export default Dashboard;
