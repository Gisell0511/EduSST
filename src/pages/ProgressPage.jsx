import React from "react";

export default function ProgressBar({ current, total }) {
  const pct = Math.round(((current) / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
