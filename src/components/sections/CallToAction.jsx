import React from 'react'
import Button from '../ui/Button'

export default function CallToAction() {
  return (
    <section id="cta" className="section-padding bg-dark text-warm-white text-center">
      <div className="container-max max-w-2xl mx-auto space-y-8">
        <h2 className="text-headline font-heading font-bold">
          Ready for a smoother household?
        </h2>
        <p className="text-body-lg text-muted">
          Stop arguing over who bought the last paper towels. Start living with clarity.
        </p>
        <div className="pt-4">
          <Button 
            variant="primary" 
            className="text-lg px-8 py-4"
            onClick={() => alert("Thanks for your interest! We'll notify you when early access begins.")}
          >
            Get Early Access
          </Button>
        </div>
      </div>
    </section>
  )
}
