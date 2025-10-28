// En components/Quiz/Timer.jsx
import { useState, useEffect } from 'react';

const Timer = ({ duration, onTimeUp, currentQuestion }) => { // ← agregar currentQuestion prop
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    // Reset timer cuando cambia la pregunta
    setTimeLeft(duration);
    
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
  }, [duration, onTimeUp, currentQuestion]); // ← agregar currentQuestion como dependencia

  const progress = (timeLeft / duration) * 100;

  return (
    <div className="timer">
      <div className="timer-text">Tiempo: {timeLeft}s</div>
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