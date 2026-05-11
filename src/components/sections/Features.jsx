import React from 'react'
import { features } from '../../data/features'
import FeatureCard from '../ui/FeatureCard'
import SectionLabel from '../ui/SectionLabel'

export default function Features() {
  const largeFeature = features.find(f => f.size === "large")
  const smallFeatures = features.filter(f => f.size === "small")

  return (
    <section className="section-padding bg-off-white">
      <div className="container-max">
        <SectionLabel>What's Inside</SectionLabel>
        <h2 className="text-headline font-heading font-bold mt-4 mb-16">
          Four tools. One shared picture.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large feature — spans 2 columns */}
          <div className="lg:col-span-2">
            <FeatureCard feature={largeFeature} large />
          </div>

          {/* Small features stacked */}
          <div className="space-y-6">
            {smallFeatures.slice(0, 2).map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Last small feature — full width */}
          <div className="lg:col-span-3">
            <FeatureCard feature={smallFeatures[2]} wide />
          </div>
        </div>
      </div>
    </section>
  )
}
