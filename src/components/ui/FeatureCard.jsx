import React from 'react'

export default function FeatureCard({ feature, large = false, wide = false }) {
  return (
    <div className={`bg-white rounded-card p-8 shadow-card flex flex-col ${large ? 'h-full justify-center' : ''}`}>
      <h3 className={`font-heading font-bold text-dark mb-4 ${large ? 'text-headline' : 'text-title'}`}>
        {feature.title}
      </h3>
      <div className={`${wide ? 'md:grid md:grid-cols-2 md:gap-8' : ''}`}>
        <div className="mb-6">
          <h4 className="text-label text-muted uppercase tracking-widest mb-2">What it does</h4>
          <p className="text-body text-dark-soft">{feature.whatItDoes}</p>
        </div>
        <div>
          <h4 className="text-label text-accent uppercase tracking-widest mb-2">Why it matters</h4>
          <p className="text-body text-dark-soft">{feature.whyItMatters}</p>
        </div>
      </div>
    </div>
  )
}
