import React from 'react'

export default function RotatedTag({ children, className = '' }) {
  return (
    <span className={`rotated-tag ${className}`}>
      {children}
    </span>
  )
}
