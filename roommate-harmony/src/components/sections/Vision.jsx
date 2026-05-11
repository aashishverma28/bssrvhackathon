import React from 'react'
import SectionLabel from '../ui/SectionLabel'
import RoughUnderline from '../shared/RoughUnderline'

export default function Vision() {
  return (
    <section className="section-padding">
      <div className="container-max max-w-3xl mx-auto text-center">
        <SectionLabel>Why We Built This</SectionLabel>
        <h2 className="text-headline font-heading font-bold mt-6">
          Shared living should not require a mediator.{" "}
          <RoughUnderline>But sometimes it needs one.</RoughUnderline>
        </h2>
        <p className="text-body-lg text-dark-soft mt-8">
          We built Roommate Harmony because the problem is not that people are
          bad roommates. The problem is that nobody has a shared picture of
          what is actually happening. When everyone sees the same data,
          fairness becomes easier to talk about.
        </p>
        <p className="text-body text-muted mt-4">
          Our goal is not to automate relationships. It is to make the
          conversations that matter a little less difficult.
        </p>
      </div>
    </section>
  )
}
