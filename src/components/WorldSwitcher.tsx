import { useEffect, useRef, useState } from "react";
import { WORLDS, useWorld } from "./WorldTheme";

export function WorldSwitcher() {
  const { world, setWorld } = useWorld();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = WORLDS.find((w) => w.id === world)!;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-pixel text-[0.7rem] px-3 py-1.5 border-2 border-[var(--color-border)] rounded"
        style={{
          background: open ? "var(--color-card)" : "transparent",
          color: "var(--color-foreground)",
          boxShadow: open ? "var(--shadow-pixel-sm)" : "none",
        }}
        aria-label="Switch world theme"
        aria-expanded={open}
      >
        {current.emoji} <span className="hidden sm:inline">{current.name}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 p-3 z-30 animate-pixel-pop"
          style={{
            width: 300,
            background: "var(--color-card)",
            border: "2px solid var(--color-border)",
            borderRadius: 8,
            boxShadow: "var(--shadow-pixel-lg)",
          }}
        >
          <div className="font-pixel text-[0.6rem] text-muted-foreground uppercase mb-2 px-1 tracking-wider">
            Choose your world
          </div>
          <div className="grid grid-cols-2 gap-2">
            {WORLDS.map((w) => {
              const active = w.id === world;
              return (
                <button
                  key={w.id}
                  onClick={() => { setWorld(w.id); setOpen(false); }}
                  className={`world-card-btn ${active ? "active" : ""}`}
                  style={{
                    background: `linear-gradient(135deg, ${w.swatches[0]}88, ${w.swatches[2]}88)`,
                    borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                  }}
                >
                  <div className="world-card-emoji">{w.emoji}</div>
                  <div className="world-card-name">{w.name}</div>
                  <div className="world-card-blurb">{w.blurb}</div>
                  <div className="world-card-swatches">
                    {w.swatches.map((c, i) => (
                      <span key={i} className="world-card-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
