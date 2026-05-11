import React from 'react'
import AlertBlock from '../ui/AlertBlock'
import SectionLabel from '../ui/SectionLabel'
import { household } from '../../data/demoHousehold'

export default function EarlyWarning() {
  const alert = household.alerts[0]

  return (
    <section className="section-padding bg-dark">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <SectionLabel className="text-muted">
              Before It Becomes a Fight
            </SectionLabel>
            <h2 className="text-headline font-heading font-bold text-warm-white">
              We flag the quiet problems.
            </h2>
            <p className="text-body-lg text-muted">
              Most conflicts don't start with a big argument. They start with
              someone slowly disengaging — fewer chores, skipped grocery runs,
              avoided shared decisions. Roommate Harmony tracks these
              micro-patterns and sends early signals so the household can
              recalibrate before things escalate.
            </p>
          </div>

          <AlertBlock alert={alert} />

        </div>
      </div>
    </section>
  )
}
