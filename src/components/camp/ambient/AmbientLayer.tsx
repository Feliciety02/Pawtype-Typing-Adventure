import { useMemo } from "react";
import type { WorldId } from "../../shared/WorldTheme";
import type { TimeOfDay } from "../../../lib/camp/timeOfDay";

/**
 * AmbientLayer — theme + time-of-day driven particles.
 * Modular: add a new theme's particle profile in THEME_PARTICLES.
 */

type ParticleKind = "butterfly" | "firefly" | "leaf" | "petal" | "cloud" | "star";

const THEME_PARTICLES: Record<WorldId, ParticleKind[]> = {
  cafe:     ["butterfly", "cloud"],
  forest:   ["leaf", "butterfly", "firefly"],
  ocean:    ["cloud"],
  sakura:   ["petal", "petal", "cloud"],
  castle:   ["cloud", "firefly"],
  space:    ["star", "star", "star"],
  autumn:   ["leaf", "leaf", "cloud"],
  mushroom: ["firefly", "firefly"],
  sunflower:["butterfly", "butterfly", "cloud"],
  "volcanic-forge":     ["firefly"],
  "desert-oasis":       ["cloud"],
  "steam-punk-workshop":["firefly"],
  "frostveil-kingdom":  ["petal", "star"],
};

const EMOJI: Record<ParticleKind, string> = {
  butterfly: "🦋",
  firefly: "✨",
  leaf: "🍂",
  petal: "🌸",
  cloud: "☁️",
  star: "⭐",
};

type Particle = { kind: ParticleKind; id: number; top: number; left: number; delay: number; dur: number };

export function AmbientLayer({ world, time }: { world: WorldId; time: TimeOfDay }) {
  const particles = useMemo<Particle[]>(() => {
    const kinds = THEME_PARTICLES[world] ?? ["cloud"];
    const out: Particle[] = [];
    let id = 0;
    // Base pass — a few of each configured kind
    kinds.forEach((kind, idx) => {
      const count = kind === "cloud" ? 3 : kind === "star" ? 12 : 6;
      for (let i = 0; i < count; i++) {
        out.push({
          kind,
          id: id++,
          top: kind === "cloud" ? 5 + Math.random() * 25 :
               kind === "star"  ? 5 + Math.random() * 45 :
               10 + Math.random() * 55,
          left: Math.random() * 90,
          delay: Math.random() * 6 + idx * 0.5,
          dur: kind === "cloud" ? 55 + Math.random() * 20 :
               kind === "butterfly" ? 10 + Math.random() * 6 :
               kind === "leaf" || kind === "petal" ? 12 + Math.random() * 6 :
               8 + Math.random() * 5,
        });
      }
    });
    // Add fireflies at night, extra stars at night
    if (time === "night") {
      for (let i = 0; i < 10; i++) {
        out.push({
          kind: "firefly", id: id++, top: 20 + Math.random() * 60, left: Math.random() * 95,
          delay: Math.random() * 5, dur: 6 + Math.random() * 4,
        });
      }
    }
    return out;
  }, [world, time]);

  return (
    <div className="camp-layer" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`camp-particle camp-${p.kind}`}
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        >
          {EMOJI[p.kind]}
        </span>
      ))}
    </div>
  );
}
