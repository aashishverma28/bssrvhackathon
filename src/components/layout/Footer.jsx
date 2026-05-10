import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-dark text-warm-white py-12 px-6">
      <div className="container-max flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-heading font-bold text-xl tracking-tight text-white">
          Roommate<span className="text-accent">Harmony</span>
        </div>
        <div className="text-small text-muted flex gap-6 text-center">
          <span className="text-white font-medium">Made By Aashish Verma & Jimani Bharadwaj</span>
        </div>
        <div className="text-small text-muted">
          &copy; {new Date().getFullYear()} Made By Team Rhino Runtime
        </div>
      </div>
    </footer>
  )
}
