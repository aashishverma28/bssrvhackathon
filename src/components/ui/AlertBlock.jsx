import React from 'react'

export default function AlertBlock({ alert }) {
  if (!alert) return null;

  return (
    <div className="alert-block">
      <div className="flex items-start justify-between mb-4">
        <span className="uppercase text-accent font-bold tracking-widest">
          Early Warning Signal
        </span>
        <span className="text-muted">Just now</span>
      </div>
      <p className="text-body mb-4">
        <span className="text-white font-semibold">{alert.member}'s</span> participation has dropped <span className="text-accent">{alert.drop}%</span> over the {alert.period}.
      </p>
      <div className="bg-dark p-4 rounded-rough border border-dark-soft mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-muted text-label mb-1">Chores Completed</span>
            <span className="text-white">{alert.choresCompleted} / {alert.choresAssigned}</span>
          </div>
          <div>
            <span className="block text-muted text-label mb-1">Expenses Logged</span>
            <span className="text-white">{alert.expensesLogged}</span>
          </div>
        </div>
      </div>
      <p className="text-muted text-small">
        This is not an accusation — just a signal. Consider a check-in.
      </p>
    </div>
  )
}
