import React from 'react'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import Hero from '../sections/Hero'
import Problem from '../sections/Problem'
import Solution from '../sections/Solution'
import Features from '../sections/Features'
import HowItWorks from '../sections/HowItWorks'
import EarlyWarning from '../sections/EarlyWarning'
import DemoData from '../sections/DemoData'
import UseCases from '../sections/UseCases'
import Vision from '../sections/Vision'
import CallToAction from '../sections/CallToAction'

export default function Landing({ onNavigate }) {
  return (
    <>
      <Navbar onNavigate={onNavigate} />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <EarlyWarning />
      <DemoData />
      <UseCases />
      <Vision />
      <CallToAction />
      <Footer />
    </>
  )
}
