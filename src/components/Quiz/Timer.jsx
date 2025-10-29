// components/Quiz/Timer.jsx
import { useState, useEffect, useRef } from 'react';

const Timer = ({ duration, onTimeUp, currentQuestion, isLastQuestion }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    console.log('⏰ Timer - Iniciando efecto:', { 
      currentQuestion, 
      isLastQuestion,
      duration 
    });
    
    // LIMPIAR TIMER ANTERIOR
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // RESETEAR ESTADO DE PAUSA - IMPORTANTE
    setIsPaused(false);
    setTimeLeft(duration);

    // Si es la última pregunta, pausar
    if (isLastQuestion) {
      console.log('⏸️ Timer - Última pregunta, pausando');
      setIsPaused(true);
      return;
    }

    // INICIAR NUEVO TIMER
    console.log('▶️ Timer - Iniciando nuevo timer');
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          console.log('⏰ Timer - Tiempo agotado');
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log('🧹 Timer - Cleanup');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [duration, onTimeUp, currentQuestion, isLastQuestion]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="timer">
      <div className="timer-text">
        Tiempo: {timeLeft}s 
        {isPaused && " ⏸️ (Pausado)"}
      </div>
      <div className="timer-bar">
        <div 
          className="timer-progress" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;