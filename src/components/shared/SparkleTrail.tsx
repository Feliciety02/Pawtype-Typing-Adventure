import { useEffect, useRef, useState } from "react";

type Spark = { id: number; x: number; y: number; dx: number; dy: number };

export function SparkleTrail({ enabled }: { enabled: boolean }) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setSparks([]);
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1 && e.key !== " ") return;
      const now = Date.now();
      if (now - lastRef.current < 30) return;
      lastRef.current = now;

      const target = (document.activeElement as HTMLElement | null) ?? document.body;
      const rect = target.getBoundingClientRect();
      const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * Math.min(rect.width, 200);
      const y = rect.top + rect.height / 2 + (Math.random() - 0.5) * Math.min(rect.height, 60);

      const batch: Spark[] = Array.from({ length: 3 }).map(() => ({
        id: idRef.current++,
        x,
        y,
        dx: (Math.random() - 0.5) * 60,
        dy: -20 - Math.random() * 40,
      }));
      setSparks((prev) => [...prev, ...batch]);
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !batch.find((b) => b.id === s.id)));
      }, 700);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {sparks.map((s) => (
        <span
          key={s.id}
          className="sparkle-trail-dot"
          style={
            {
              left: s.x,
              top: s.y,
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
            } as React.CSSProperties
          }
        >
          ✦
        </span>
      ))}
    </div>
  );
}
