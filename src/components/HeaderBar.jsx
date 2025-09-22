import React, { useContext } from "react";
import { ProgressContext } from "../context/ProgressContext";

export default function Header({ onHome, onLogout }) {
  const { points, resetProgress } = useContext(ProgressContext);

  return (
    <header className="header">
      <div className="header-left">
        <button className="logo-btn" onClick={onHome}>
          <div className="logo-square">SST</div>
        </button>
        <div className="title-block">
          <div className="title">Plataforma SST — Demo</div>
          <div className="subtitle">Primera etapa — Gamificación</div>
        </div>
      </div>
      <div className="header-right">
        <div className="points">Puntos: <strong>{points}</strong></div>
        <button className="reset-btn" onClick={resetProgress}>Reset</button>
        <button className="reset-btn" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}
