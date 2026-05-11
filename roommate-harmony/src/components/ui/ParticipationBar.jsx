import React from 'react'

export default function ParticipationBar({ name, score }) {
  // Dynamic color for demo purposes
  const barColor = score > 80 ? 'bg-accent-sage' : score > 50 ? 'bg-accent-amber' : 'bg-accent';

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 font-medium text-dark-soft">{name}</div>
      <div className="flex-1 h-3 bg-border-soft rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} rounded-full`} 
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="w-12 text-right text-muted font-mono text-small">{score}%</div>
    </div>
  )
}
