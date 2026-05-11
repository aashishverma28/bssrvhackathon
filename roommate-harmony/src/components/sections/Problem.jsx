import React from 'react'
import { problems } from '../../data/problems'
import ProblemItem from '../ui/ProblemItem'
import SectionLabel from '../ui/SectionLabel'

export default function Problem() {
  return (
    <section id="problem" className="section-padding bg-off-white">
      <div className="container-max">
        <SectionLabel>The Reality of Shared Living</SectionLabel>
        <h2 className="text-headline font-heading font-bold mt-4 mb-16 max-w-2xl">
          Most household tension is invisible until it isn't.
        </h2>
        <div className="space-y-0">
          {problems.map((problem, index) => (
            <ProblemItem
              key={problem.id}
              problem={problem}
              offset={index % 2 !== 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
