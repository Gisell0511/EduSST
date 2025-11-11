// pages/LevelSelectionPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../contexts/ProgressContext";

export default function LevelSelectionPage() {
  const { progress, unlockedLevels } = useProgress();
  
  // ✅ MANEJO SEGURO - Usar unlockedLevels directamente del contexto
  const safeUnlockedLevels = unlockedLevels || [1];

  const levels = [
    {
      id: '1',
      name: 'Básico',
      description: 'Conceptos fundamentales de seguridad y salud en el trabajo',
      icon: '🏁',
      color: '#4CAF50',
      unlocked: true, // Nivel 1 siempre desbloqueado
      totalQuestions: 150,
      categories: ['Fundamentos SST', 'Anatomía', 'Riesgos', 'Legislación', 'Seguridad Industrial I']
    },
    {
      id: '2', 
      name: 'Intermedio',
      description: 'Temas avanzados y especializados en SST',
      icon: '⚡',
      color: '#FF9800',
      unlocked: safeUnlockedLevels.includes(2),
      totalQuestions: 150,
      categories: ['Medicina Preventiva', 'Riesgos Químicos', 'Gestión de Riesgos', 'Ergonomía', 'Psicología']
    },
    {
      id: '3',
      name: 'Avanzado', 
      description: 'Expertise en gestión de seguridad y salud',
      icon: '🚀',
      color: '#F44336',
      unlocked: safeUnlockedLevels.includes(3),
      totalQuestions: 125,
      categories: ['Riesgos Físicos', 'Seguridad Industrial II', 'Sistemas Gestión', 'Administración SST']
    }
  ];

  return (
    <div className="level-selection-page">
      <div className="level-selection-container">
        <div className="level-selection-header">
          <h1>🎯 Quizzes por Nivel</h1>
          <p>Selecciona un nivel para comenzar tu evaluación de Seguridad y Salud en el Trabajo</p>
        </div>

        <div className="levels-grid">
          {levels.map(level => (
            <div 
              key={level.id}
              className={`level-card ${level.unlocked ? 'unlocked' : 'locked'}`}
              style={{ borderLeftColor: level.color }}
            >
              <div className="level-icon" style={{ color: level.color }}>
                {level.icon}
              </div>
              
              <div className="level-content">
                <h3>{level.name}</h3>
                <p>{level.description}</p>
                
                <div className="level-features">
                  <div className="level-stat">
                    <i className="fas fa-question-circle"></i>
                    <span>{level.totalQuestions} preguntas</span>
                  </div>
                  <div className="level-stat">
                    <i className="fas fa-folder"></i>
                    <span>{level.categories.length} categorías</span>
                  </div>
                </div>

                <div className="categories-list">
                  {level.categories.map((category, index) => (
                    <span key={index} className="category-tag">
                      {category}
                    </span>
                  ))}
                </div>

                {level.unlocked ? (
                  <Link 
                    to={`/quiz/${level.id}`}
                    className="btn btn-primary level-btn"
                  >
                    <i className="fas fa-play-circle"></i>
                    Comenzar Quiz
                  </Link>
                ) : (
                  <div className="locked-message">
                    <i className="fas fa-lock"></i>
                    <span>Completa el nivel anterior para desbloquear</span>
                  </div>
                )}
              </div>

              {!level.unlocked && (
                <div className="level-lock-overlay">
                  <i className="fas fa-lock"></i>
                  <p>Nivel Bloqueado</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="level-selection-footer">
          <div className="progression-info">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Sistema Progresivo:</strong> Comienza por el nivel básico y avanza secuencialmente. 
              Cada nivel se desbloquea al completar satisfactoriamente el anterior.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}