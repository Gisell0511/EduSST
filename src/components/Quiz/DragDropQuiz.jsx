import React, { useState, useContext } from "react";
import { ProgressContext } from "../../contexts/ProgressContext";

const initialPairs = [
  { id: 't1', term: 'Peligro', target: 'd1' },
  { id: 't2', term: 'Riesgo', target: 'd2' },
  { id: 't3', term: 'EPP', target: 'd3' }
];

const definitions = [
  { id: 'd1', text: 'Situación con potencial de daño a la salud' },
  { id: 'd2', text: 'Probabilidad y severidad de que ocurra el daño' },
  { id: 'd3', text: 'Equipo de protección personal' }
];

export default function DragDropQuiz({ question, onAnswer }){
  const [items, setItems] = useState(shuffle(initialPairs));
  const [dropped, setDropped] = useState({});
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { addPoints } = useContext(ProgressContext);

  function onDragStart(e, id){
    e.dataTransfer.setData('text/plain', id);
  }

  function onDrop(e, defId){
    const id = e.dataTransfer.getData('text/plain');
    setDropped(prev => ({...prev, [id]: defId}));
  }

  function onFinish(){
    // comprobaremos pares correctos
    let correct = 0;
    initialPairs.forEach(p => {
      if(dropped[p.id] === p.target) correct++;
    });
    
    const gained = correct * 10;
    if(gained) addPoints(gained);
    
    setCompleted(true);
    setShowResults(true);
    onAnswer(correct === initialPairs.length);
  }

  function getTermForDefinition(defId) {
    const termId = Object.entries(dropped).find(([k,v]) => v === defId)?.[0];
    return items.find(item => item.id === termId)?.term || '---';
  }

  function isCorrectMatch(termId, defId) {
    const pair = initialPairs.find(p => p.id === termId);
    return pair?.target === defId;
  }

  return (
    <div className="drag-drop-quiz">
      <div className="quiz-question">{question.question}</div>
      
      <div className="drag-drop-container">
        <div className="terms-section">
          <div className="section-title">Términos</div>
          <div className="terms-list">
            {items.map(it => (
              <div 
                key={it.id} 
                draggable={!completed}
                onDragStart={(e) => onDragStart(e, it.id)}
                className={`term-item ${dropped[it.id] ? 'dropped' : ''}`}
              >
                {it.term}
              </div>
            ))}
          </div>
        </div>

        <div className="definitions-section">
          <div className="section-title">Definiciones</div>
          <div className="definitions-list">
            {definitions.map(d => (
              <div 
                key={d.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, d.id)}
                className={`definition-item ${showResults ? (isCorrectMatch(getTermIdFromDropped(d.id), d.id) ? 'correct' : 'incorrect') : ''}`}
              >
                <div className="definition-text">{d.text}</div>
                <div className="dropped-term">
                  {getTermForDefinition(d.id)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quiz-actions">
        <button 
          className="btn btn-primary" 
          onClick={onFinish} 
          disabled={completed || Object.keys(dropped).length !== initialPairs.length}
        >
          {completed ? 'Completado' : 'Finalizar'}
        </button>
      </div>

      {showResults && (
        <div className="quiz-feedback">
          <div className="feedback-title">
            {getCorrectCount() === initialPairs.length ? '🎉 ¡Perfecto!' : '📝 Resultados:'}
          </div>
          <div className="feedback-text">
            Tienes {getCorrectCount()} de {initialPairs.length} pares correctos.
            {getCorrectCount() === initialPairs.length ? ' ¡Excelente trabajo!' : ' Sigue practicando!'}
          </div>
        </div>
      )}
    </div>
  );

  function getTermIdFromDropped(defId) {
    return Object.entries(dropped).find(([k,v]) => v === defId)?.[0];
  }

  function getCorrectCount() {
    let correct = 0;
    initialPairs.forEach(p => {
      if(dropped[p.id] === p.target) correct++;
    });
    return correct;
  }
}

function shuffle(arr){
  return [...arr].sort(() => Math.random() - 0.5);
}