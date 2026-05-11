import React from 'react'
import StabilityScore from './StabilityScore'

export default function DashboardSnapshot({ detailed = false }) {
  return (
    <div className="bg-white rounded-card shadow-card p-6 md:p-8 border border-border-soft/50 relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-amber" />
      
      <div className="mb-8">
        <h3 className="text-small uppercase tracking-widest text-muted mb-4">Household Status</h3>
        <StabilityScore score={74} label="Moderate" />
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-small mb-2">
            <span className="font-semibold text-dark">Chore Completion</span>
            <span className="text-muted">This Week</span>
          </div>
          <div className="flex gap-1 h-2">
            <div className="bg-accent-sage h-full w-[45%] rounded-l-full" />
            <div className="bg-accent h-full w-[25%]" />
            <div className="bg-border-soft h-full flex-1 rounded-r-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-small mb-2">
            <span className="font-semibold text-dark">Expense Balance</span>
            <span className="text-accent text-small">Action Needed</span>
          </div>
          <div className="bg-off-white p-3 rounded-soft border border-border-soft text-small flex justify-between items-center">
            <span className="text-dark-soft">Alex owes</span>
            <span className="font-mono font-bold text-dark">₹48.50</span>
          </div>
        </div>

        {detailed && (
          <div className="pt-4 border-t border-border-soft mt-6">
            <span className="inline-block bg-alert-bg text-alert-text text-xs px-2 py-1 rounded font-mono mb-2">ALERT_TRIGGERED</span>
            <p className="text-small text-dark-soft">
              Sara has completed 0 of 4 assigned tasks this week. Would you like to re-balance the chore schedule?
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
