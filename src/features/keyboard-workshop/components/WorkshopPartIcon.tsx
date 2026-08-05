import type { ReactNode } from "react"

import type { KeyboardPart } from "../types"

const iconShapes: Record<KeyboardPart, ReactNode> = {
  keycaps: (
    <>
      <path d="M5 9 16 3l11 6-11 6Z" />
      <path d="M5 9v13l11 7V15M27 9v13l-11 7" fill="none" />
    </>
  ),
  case: (
    <>
      <path d="M5 9 16 3l11 6-11 6Z" fill="none" />
      <path d="M5 9v13l11 7V15M27 9v13l-11 7" fill="none" />
    </>
  ),
  frame: (
    <>
      <rect x="6" y="6" width="20" height="20" rx="1" fill="none" />
      <rect x="3" y="3" width="5" height="5" />
      <rect x="24" y="3" width="5" height="5" />
      <rect x="3" y="24" width="5" height="5" />
      <rect x="24" y="24" width="5" height="5" />
    </>
  ),
  plate: (
    <>
      <path d="m16 3 13 13-13 13L3 16Z" />
      <path d="m16 8 8 8-8 8-8-8Z" fill="none" />
      <path d="M16 10v12M10 16h12" fill="none" />
    </>
  ),
  switches: (
    <>
      <path d="M6 9h20v17H6Z" />
      <path d="m10 9 3-5h6l3 5M10 14v8m4-8v8m4-8v8m4-8v8" fill="none" />
      <rect x="13" y="5" width="6" height="6" />
    </>
  ),
  stabilizers: (
    <>
      <path d="M7 24 22 9" fill="none" strokeWidth="5" />
      <path d="m20 4 2 5 5 2 2-2-4-3 1-3-3-1Z" />
      <rect x="3" y="22" width="8" height="7" rx="1" />
      <path d="M6 25h2" fill="none" />
    </>
  ),
  knob: (
    <>
      <circle cx="16" cy="16" r="12" fill="none" strokeWidth="4" />
      <circle cx="16" cy="16" r="5" />
    </>
  ),
  badge: (
    <>
      <path d="M16 3 27 7v9c0 7-5 11-11 14C10 27 5 23 5 16V7Z" />
      <path d="M16 8 22 10v6c0 4-2 6-6 8-4-2-6-4-6-8v-6Z" fill="none" />
    </>
  ),
  lighting: (
    <>
      <circle cx="16" cy="16" r="7" />
      <path d="M16 2v5m0 18v5M2 16h5m18 0h5M6 6l4 4m12 12 4 4M26 6l-4 4M10 22l-4 4" fill="none" />
    </>
  ),
  sound: (
    <>
      <path d="M12 8v15a5 5 0 1 1-3-5V10l17-5v13a5 5 0 1 1-3-5V3Z" />
      <path d="m12 9 14-4" fill="none" />
    </>
  ),
  builds: (
    <>
      <path d="M5 5h8v8H5Zm14 0h8v8h-8ZM5 19h8v8H5Zm14 0h8v8h-8Z" />
      <path d="M13 9h6M9 13v6m14-6v6m-10 4h6" fill="none" />
    </>
  ),
}

export function WorkshopPartIcon({ part }: { part: KeyboardPart }) {
  return (
    <svg
      className="blacksmith-workshop-menu__icon"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <g>{iconShapes[part]}</g>
    </svg>
  )
}
