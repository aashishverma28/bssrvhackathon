import React from 'react'

export default function StabilityScore({ score, label }) {
  // Determine color based on score (mock logic for UI)
  const scoreColor = score > 80 ? 'text-accent-sage' : score > 50 ? 'text-accent-amber' : 'text-accent';

  return (
    <div className="flex items-center gap-4">
      <div className={`text-display font-heading font-bold ${scoreColor}`}>
        {score}
      </div>
      <div className="flex flex-col">
        <span className="text-title font-heading font-semibold text-dark">{label}</span>
        <span className="text-muted text-small">Household Health</span>
      </div>
    </div>
  )
}
