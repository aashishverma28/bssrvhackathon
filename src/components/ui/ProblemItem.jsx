import React from 'react'

export default function ProblemItem({ problem, offset = false }) {
  return (
    <div className={`py-8 border-t border-border-soft ${offset ? 'lg:ml-24' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-start">
        <div className="md:col-span-1">
          <span className="text-label text-accent uppercase tracking-widest font-semibold">
            {problem.label} {problem.id < 10 ? `0${problem.id}` : problem.id}
          </span>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-title font-heading font-bold text-dark mb-3">
            {problem.title}
          </h3>
          <p className="text-body-lg text-dark-soft max-w-2xl">
            {problem.description}
          </p>
        </div>
      </div>
    </div>
  )
}
