import { useEffect, useRef, useState } from "react";
import { WORLDS, useWorld } from "../shared/WorldTheme";

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
        className="pixel-btn pixel-btn-secondary"
        aria-label="Switch world theme"
        aria-expanded={open}
      >
        {current.emoji} {current.name}
      </button>

      {open && (
        <div
          className="pixel-card absolute right-0 mt-2 p-3 z-30 animate-pixel-pop"
          style={{ width: 280 }}
        >
          <div className="font-pixel text-[0.65rem] text-muted-foreground uppercase mb-2 px-1">
            Choose a world
          </div>
          <div className="grid grid-cols-2 gap-2">
            {WORLDS.map((w) => {
              const active = w.id === world;
              return (
                <button
                  key={w.id}
                  onClick={() => { setWorld(w.id); setOpen(false); }}
                  className="pixel-card-sm p-2 text-left transition-transform hover:-translate-y-0.5"
                  style={
                    active
                      ? { outline: `2px solid var(--color-primary)`, outlineOffset: 2 }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base leading-none">{w.emoji}</span>
                    <span className="font-pixel text-[0.65rem]">{w.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {w.swatches.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          width: 16, height: 16,
                          background: c,
                          border: "1.5px solid var(--color-border)",
                          borderRadius: 2,
                        }}
                      />
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
