import React from 'react'
import SectionLabel from '../ui/SectionLabel'
import StickyNote from '../shared/StickyNote'
import DashboardSnapshot from '../ui/DashboardSnapshot'

export default function Solution() {
  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20 items-start">

          {/* Text — 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <SectionLabel>What Roommate Harmony Does</SectionLabel>
            <h2 className="text-headline font-heading font-bold">
              Turns everyday household activity into clarity.
            </h2>
            <p className="text-body-lg text-dark-soft">
              Roommate Harmony collects inputs from all roommates — chores
              completed, expenses logged, participation patterns — and runs
              them through an AI layer that detects imbalance, generates
              stability scores, and surfaces mediation suggestions before
              things escalate.
            </p>
            <p className="text-body text-muted">
              It does not replace communication. It makes communication easier
              by giving everyone the same honest picture.
            </p>
            <StickyNote>
              "We just needed everyone to see the same data."
            </StickyNote>
          </div>

          {/* Dashboard — 2 columns */}
          <div className="lg:col-span-2 pt-8">
            <DashboardSnapshot detailed />
          </div>

        </div>
      </div>
    </section>
  )
}
