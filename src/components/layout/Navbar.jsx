import React from 'react'

export default function Navbar({ onNavigate }) {
  return (
    <nav className="fixed top-0 w-full bg-warm-white/90 backdrop-blur-md z-50 border-b border-border-soft">
      <div className="container-max px-6 h-20 flex items-center justify-between">
        <div className="font-heading font-bold text-dark text-xl tracking-tight flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
          <span>Roommate<span className="text-accent">Harmony</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-small font-medium text-dark-soft">
          <a href="#problem" className="hover:text-accent transition-colors">The Reality</a>
          <a href="#how-it-works" className="hover:text-accent transition-colors">How it Works</a>
          <a href="#demo" className="hover:text-accent transition-colors">Demo</a>
          <button 
            className="text-dark font-semibold hover:text-accent transition-colors ml-4"
            onClick={() => onNavigate('login')}
          >
            Login
          </button>
          <button 
            className="bg-accent text-warm-white px-5 py-2 rounded-soft hover:bg-accent/90 transition-colors ml-4"
            onClick={() => onNavigate('signup')}
          >
            Sign Up
          </button>

        </div>
      </div>
    </nav>
  )
}
