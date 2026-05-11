import React from 'react'
import { useCases } from '../../data/useCases'
import SectionLabel from '../ui/SectionLabel'

export default function UseCases() {
  return (
    <section className="section-padding bg-off-white">
      <div className="container-max">
        <SectionLabel>Who This Is For</SectionLabel>
        <h2 className="text-headline font-heading font-bold mt-4 mb-12">
          If you share a space, this is for you.
        </h2>
        <div className="space-y-8 max-w-2xl">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="border-b border-border-soft pb-8 last:border-0"
            >
              <p className="text-title font-heading font-semibold">
                {useCase.label}
              </p>
              <p className="text-body text-muted mt-1">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
