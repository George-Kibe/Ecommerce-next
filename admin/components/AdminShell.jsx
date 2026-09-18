"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'

/**
 * Holds the sidebar open/closed state. Kept separate from the root layout so
 * the layout itself can stay a server component and export metadata.
 */
export default function AdminShell({ children }) {
  const [navIsOpen, setNavIsOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-row h-screen bg-gray-200 justify-between w-full text-black">
        <Navbar show={navIsOpen} />
        <button
          onClick={() => setNavIsOpen((open) => !open)}
          className="self-start px-1"
          aria-label={navIsOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navIsOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
        </button>
        {/*
          min-w-0 is the fix for tables being clipped on phones. A flex child
          defaults to `min-width: auto`, so a wide table forced this column
          wider than the screen and the overflow was cut off — the Edit/Delete
          column was simply unreachable at 320–390px. With min-w-0 the column
          stays within the viewport and the tables scroll inside it instead.
        */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
