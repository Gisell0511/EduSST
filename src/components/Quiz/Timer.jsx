// components/Quiz/Timer.jsx
import { useState, useEffect } from 'react';

const Timer = ({ duration, onTimeUp, currentQuestion, isLastQuestion }) => { // ← agregar isLastQuestion
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Si es la última pregunta, pausar el timer
    if (isLastQuestion) {
      console.log('⏸️ Última pregunta - Timer pausado');
      setIsPaused(true);
      return;
    }

    // Reset timer cuando cambia la pregunta
    setTimeLeft(duration);
    setIsPaused(false);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, onTimeUp, currentQuestion, isLastQuestion]);

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="timer">
      <div className="timer-text">
        Tiempo: {timeLeft}s 
        {isLastQuestion && " ⏸️ (Pausado)"}
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