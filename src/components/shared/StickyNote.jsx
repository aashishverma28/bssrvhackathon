import React from 'react'

export default function StickyNote({ children }) {
  return (
    <div className="relative mt-8 inline-block transform rotate-slight-pos">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-4 bg-yellow-500/20 rounded-full blur-sm" />
      <div className="bg-[#FEF5B9] p-6 shadow-md border border-[#F2E595] rounded-sm max-w-sm">
        <p className="font-body text-dark italic text-body-lg">
          {children}
        </p>
      </div>
    </div>
  )
}
