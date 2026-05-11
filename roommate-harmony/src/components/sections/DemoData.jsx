import React from 'react'
import { household } from '../../data/demoHousehold'
import StabilityScore from '../ui/StabilityScore'
import ParticipationBar from '../ui/ParticipationBar'
import SectionLabel from '../ui/SectionLabel'

export default function DemoData() {
  return (
    <section id="demo" className="section-padding">
      <div className="container-max">
        <SectionLabel>A Real Household Snapshot</SectionLabel>
        <h2 className="text-headline font-heading font-bold mt-4 mb-12">
          Here's what your dashboard could look like.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Stability Score */}
          <div className="space-y-2">
            <p className="text-small text-muted uppercase tracking-widest">
              Stability Score
            </p>
            <StabilityScore score={household.stabilityScore} label={household.stabilityLabel} />
          </div>

          {/* Participation */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-small text-muted uppercase tracking-widest">
              Chore Completion Rate — {household.period}
            </p>
            {household.participation.map(member => (
              <ParticipationBar
                key={member.name}
                name={member.name}
                score={member.score}
              />
            ))}
            <p className="text-small text-muted mt-6">
              Shared expenses logged: ₹{household.expenses.total} total —
              Outstanding imbalance: ₹{household.expenses.imbalance} ({household.expenses.imbalanceMember})
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
