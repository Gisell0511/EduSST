import React, { useContext, useState } from "react";
import { ProgressContext } from "../contexts/ProgressContext";

export default function ProgressPage() {
  const { progress, totalPoints, completedQuizzes } = useContext(ProgressContext);
  const [activeTab, setActiveTab] = useState('overview');

  // Datos de ejemplo para el progreso
  const stages = [
    { id: 1, title: "Fundamentos de SST", progress: 85, totalQuestions: 20, completed: true, timeSpent: "45 min" },
    { id: 2, title: "Riesgos Laborales", progress: 60, totalQuestions: 15, completed: false, timeSpent: "30 min" },
    { id: 3, title: "Equipos de Protección", progress: 30, totalQuestions: 12, completed: false, timeSpent: "15 min" },
    { id: 4, title: "Primeros Auxilios", progress: 0, totalQuestions: 18, completed: false, timeSpent: "0 min" }
  ];

  const achievements = [
    { id: 1, name: "Primer Quiz", description: "Completa tu primer quiz", earned: true, date: "2024-01-15", icon: "🥇" },
    { id: 2, name: "Estudiante Dedicado", description: "Completa 5 quizzes", earned: true, date: "2024-01-20", icon: "📚" },
    { id: 3, name: "Maestro del Tiempo", description: "Termina un quiz en menos de 2 minutos", earned: false, icon: "⏱️" },
    { id: 4, name: "Perfeccionista", description: "Obtén 100% en un quiz", earned: false, icon: "💯" }
  ];

  const quizHistory = [
    { id: 1, name: "Quiz Fundamentos SST", score: 18, total: 20, date: "2024-01-15", time: "12:30" },
    { id: 2, name: "Quiz Riesgos Básicos", score: 12, total: 15, date: "2024-01-18", time: "14:20" },
    { id: 3, name: "Quiz EPP", score: 8, total: 12, date: "2024-01-20", time: "10:15" }
  ];

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h1 className="page-title">
          <i className="fas fa-chart-line"></i>
          Mi Progreso
        </h1>
        <div className="points-display">
          <div className="points-badge">
            <i className="fas fa-star"></i>
            {totalPoints} Puntos
          </div>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <div className="progress-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-home"></i>
          Resumen
        </button>
        <button 
          className={`tab-button ${activeTab === 'stages' ? 'active' : ''}`}
          onClick={() => setActiveTab('stages')}
        >
          <i className="fas fa-list-ul"></i>
          Etapas
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          <i className="fas fa-trophy"></i>
          Logros
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i>
          Historial
        </button>
      </div>

      {/* Contenido de los Tabs */}
      <div className="tab-content">
        {activeTab === 'overview' && <OverviewTab stages={stages} achievements={achievements} />}
        {activeTab === 'stages' && <StagesTab stages={stages} />}
        {activeTab === 'achievements' && <AchievementsTab achievements={achievements} />}
        {activeTab === 'history' && <HistoryTab quizHistory={quizHistory} />}
      </div>
    </div>
  );
}

// Componente para el Tab de Resumen
function OverviewTab({ stages, achievements }) {
  const totalStages = stages.length;
  const completedStages = stages.filter(stage => stage.completed).length;
  const totalProgress = stages.reduce((sum, stage) => sum + stage.progress, 0) / stages.length;

  return (
    <div className="overview-tab">
      {/* Estadísticas Principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{completedStages}/{totalStages}</div>
            <div className="stat-label">Etapas Completadas</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon progress">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{Math.round(totalProgress)}%</div>
            <div className="stat-label">Progreso Total</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon time">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">90min</div>
            <div className="stat-label">Tiempo Total</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon quizzes">
            <i className="fas fa-gamepad"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">3</div>
            <div className="stat-label">Quizzes Realizados</div>
          </div>
        </div>
      </div>

      {/* Próxima Etapa */}
      <div className="next-stage-section">
        <h3 className="section-title">
          <i className="fas fa-arrow-right"></i>
          Próxima Etapa
        </h3>
        <div className="next-stage-card">
          <div className="stage-info">
            <h4>Equipos de Protección</h4>
            <p>Conoce los diferentes tipos de EPP y su correcto uso</p>
          </div>
          <button className="btn btn-primary">
            Continuar
          </button>
        </div>
      </div>

      {/* Logros Recientes */}
      <div className="recent-achievements">
        <h3 className="section-title">
          <i className="fas fa-trophy"></i>
          Logros Recientes
        </h3>
        <div className="achievements-grid">
          {achievements.filter(a => a.earned).slice(0, 2).map(achievement => (
            <div key={achievement.id} className="achievement-card earned">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-date">{achievement.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para el Tab de Etapas
function StagesTab({ stages }) {
  return (
    <div className="stages-tab">
      <div className="stages-list">
        {stages.map(stage => (
          <div key={stage.id} className="stage-progress-card">
            <div className="stage-header">
              <div className="stage-title">
                <h4>Etapa {stage.id}: {stage.title}</h4>
                {stage.completed && (
                  <span className="completion-badge">
                    <i className="fas fa-check"></i>
                    Completado
                  </span>
                )}
              </div>
              <div className="stage-stats">
                <span className="time-spent">
                  <i className="fas fa-clock"></i>
                  {stage.timeSpent}
                </span>
              </div>
            </div>
            
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${stage.progress}%` }}
              ></div>
            </div>
            
            <div className="progress-info">
              <span>{stage.progress}% Completado</span>
              <span>{stage.totalQuestions} preguntas</span>
            </div>
            
            <div className="stage-actions">
              {stage.completed ? (
                <button className="btn btn-outline">
                  <i className="fas fa-redo"></i>
                  Repetir
                </button>
              ) : (
                <button className="btn btn-primary">
                  {stage.progress > 0 ? 'Continuar' : 'Comenzar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para el Tab de Logros
function AchievementsTab({ achievements }) {
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="achievements-tab">
      <div className="achievements-header">
        <div className="achievements-progress">
          <div className="progress-circle">
            <span className="progress-text">
              {earnedCount}/{totalCount}
            </span>
          </div>
          <div className="progress-info">
            <h3>Logros Desbloqueados</h3>
            <p>Has completado {Math.round((earnedCount / totalCount) * 100)}% de los logros</p>
          </div>
        </div>
      </div>

      <div className="achievements-grid">
        {achievements.map(achievement => (
          <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
            <div className="achievement-icon">
              {achievement.earned ? achievement.icon : '🔒'}
            </div>
            <div className="achievement-info">
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-description">{achievement.description}</div>
              {achievement.earned && achievement.date && (
                <div className="achievement-date">
                  <i className="fas fa-calendar"></i>
                  {achievement.date}
                </div>
              )}
            </div>
            {achievement.earned && (
              <div className="achievement-badge">
                <i className="fas fa-check"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para el Tab de Historial
function HistoryTab({ quizHistory }) {
  return (
    <div className="history-tab">
      <div className="history-list">
        {quizHistory.map(quiz => (
          <div key={quiz.id} className="history-card">
            <div className="quiz-info">
              <h4>{quiz.name}</h4>
              <div className="quiz-meta">
                <span className="quiz-date">
                  <i className="fas fa-calendar"></i>
                  {quiz.date} a las {quiz.time}
                </span>
              </div>
            </div>
            
            <div className="quiz-score">
              <div className="score-circle">
                <span className="score-number">{quiz.score}</span>
                <span className="score-total">/{quiz.total}</span>
              </div>
              <div className="score-percentage">
                {Math.round((quiz.score / quiz.total) * 100)}%
              </div>
            </div>
            
            <div className="quiz-actions">
              <button className="btn btn-outline">
                <i className="fas fa-redo"></i>
                Reintentar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}