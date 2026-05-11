import React from 'react'
import Button from '../ui/Button'
import DashboardSnapshot from '../ui/DashboardSnapshot'
import RotatedTag from '../shared/RotatedTag'

export default function Hero() {
  return (
    <section className="section-padding min-h-screen flex items-center pt-32">
      <div className="container-max w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">

          {/* Left — 3 columns */}
          <div className="lg:col-span-3 space-y-8">
            <RotatedTag>Built for real households</RotatedTag>
            <h1 className="text-display font-heading font-bold text-dark text-balance">
              Your apartment runs smoother when everyone's on the{" "}
              <span className="rough-underline">same page.</span>
            </h1>
            <p className="text-body-lg text-dark-soft max-w-xl">
              Shared living friction comes from invisible imbalances — chores
              ignored, expenses forgotten, participation fading. Roommate
              Harmony brings those signals to the surface before they become
              arguments.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button 
                variant="primary"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </Button>
              <Button 
                variant="secondary"
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Demo Data
              </Button>
            </div>
          </div>

          {/* Right — 2 columns */}
          <div className="lg:col-span-2">
            <DashboardSnapshot />
          </div>

        </div>
      </div>
    </section>
  )
}
