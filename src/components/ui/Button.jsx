import React from 'react'

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = "px-6 py-3 font-semibold rounded-rough transition-all duration-200"
  
  const variants = {
    primary: "bg-accent text-warm-white hover:bg-accent/90 shadow-sm",
    secondary: "bg-transparent text-dark border-2 border-dark hover:bg-dark hover:text-warm-white"
  }

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
