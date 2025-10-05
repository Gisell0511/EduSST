export default function StageIndicator({ stage, totalStages }) {
  return (
    <div className="stage-indicator">
      <div className="stage-text">
        Etapa {stage} / {totalStages}
      </div>
      <div className="stage-dots">
        {Array.from({ length: totalStages }, (_, i) => (
          <div 
            key={i} 
            className={`stage-dot ${i < stage ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}