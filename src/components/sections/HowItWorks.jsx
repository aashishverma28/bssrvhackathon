import React from 'react'
import { steps } from '../../data/howItWorks'
import TimelineStep from '../ui/TimelineStep'
import SectionLabel from '../ui/SectionLabel'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

          <div>
            <SectionLabel>The Process</SectionLabel>
            <h2 className="text-headline font-heading font-bold mt-4">
              Simple inputs. Honest outputs.
            </h2>
            <p className="text-body text-muted mt-4">
              The whole system runs on what your household already knows —
              just never had a shared way to see.
            </p>
          </div>

          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-12 pl-16">
              {steps.map((step, index) => (
                <TimelineStep
                  key={step.number}
                  step={step}
                  isLast={index === steps.length - 1}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
