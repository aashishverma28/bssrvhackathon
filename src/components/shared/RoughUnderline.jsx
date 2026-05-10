import React from 'react'

export default function RoughUnderline({ children, className = '' }) {
  return (
    <span className={`rough-underline ${className}`}>
      {children}
    </span>
  )
}
