export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="progress-text">
        {current} / {total}
      </div>
    </div>
  );
}