"use client"

// Shared styled primitives for the Workshop property editors

import type { ReactNode } from "react"

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b pb-3 px-3 pt-3" style={{ borderColor: "#3a2a14" }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#c89040" }}>
        {title}
      </p>
      {children}
    </div>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-xs mb-1" style={{ color: "#c8b080" }}>
      {children}
    </label>
  )
}

export function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs w-20 shrink-0" style={{ color: "#c8b080" }}>
        {label}
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-7 rounded cursor-pointer border-0"
        style={{ background: "none" }}
        aria-label={label}
      />
      <span className="text-xs font-mono" style={{ color: "#a08050" }}>
        {value}
      </span>
    </div>
  )
}

export function Slider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (v: number) => void
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs" style={{ color: "#c8b080" }}>
          {label}
        </label>
        <span className="text-xs font-mono" style={{ color: "#a08050" }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-amber-600"
        aria-label={label}
      />
    </div>
  )
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (v: T) => void
}) {
  return (
    <div className="mb-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded px-2 py-1 text-xs border outline-none"
        style={{ background: "#2a1e10", color: "#e8d0a0", borderColor: "#5a3a20" }}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs" style={{ color: "#c8b080" }}>
        {label}
      </label>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative w-10 h-5 rounded-full transition-all"
        style={{ background: checked ? "#8a5a20" : "#3a2a14" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
          style={{
            background: checked ? "#ffe0a0" : "#6a5030",
            left: checked ? "1.25rem" : "0.125rem",
          }}
        />
      </button>
    </div>
  )
}

export function ChipSelector<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (v: T) => void
}) {
  return (
    <div className="mb-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className="px-2 py-0.5 rounded text-xs transition-all"
            style={{
              background: value === o.value ? "#8a5a20" : "#2a1e10",
              color: value === o.value ? "#ffe0a0" : "#c8a870",
              border: value === o.value ? "1px solid #c8803a" : "1px solid #3a2a14",
            }}
            aria-pressed={value === o.value}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="mb-2">
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded px-2 py-1 text-xs border outline-none"
        style={{ background: "#2a1e10", color: "#e8d0a0", borderColor: "#5a3a20" }}
        aria-label={label}
      />
    </div>
  )
}
