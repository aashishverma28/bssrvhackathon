import React from 'react'

export default function TimelineStep({ step, isLast }) {
  return (
    <div className="relative">
      <div className="absolute -left-16 mt-1.5 w-4 h-4 rounded-full bg-accent border-4 border-warm-white shadow-sm z-10" />
      <div className="mb-2">
        <span className="text-accent font-mono font-bold">{step.number}</span>
      </div>
      <h3 className="text-title font-heading font-bold text-dark mb-2">
        {step.title}
      </h3>
      <p className="text-body text-dark-soft mb-3">
        {step.description}
      </p>
      <div className="bg-off-white border-l-2 border-border-soft pl-4 py-2 text-small text-muted italic">
        {step.sideNote}
      </div>
    </div>
  )
}
