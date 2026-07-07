import { useMemo } from "react";
import type { DayNightState, ParticleMood } from "./DayNightController";

type Particle = {
  id: number;
  mood: ParticleMood;
  left: number;
  top: number;
  delay: number;
  duration: number;
};

const MOOD_LABEL: Record<ParticleMood, string> = {
  pollen: "·",
  butterflies: "◆",
  dust: "·",
  fireflies: "·",
  "shooting-star": "✦",
};

const PARTICLE_COUNT: Record<ParticleMood, number> = {
  pollen: 18,
  butterflies: 7,
  dust: 16,
  fireflies: 18,
  "shooting-star": 1,
};

function random(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

export function WorldParticles({ state }: { state: DayNightState }) {
  const particles = useMemo<Particle[]>(() => {
    let id = 0;
    return state.particleMoods.flatMap((mood, moodIndex) =>
      Array.from({ length: PARTICLE_COUNT[mood] }, (_, i) => ({
        id: id++,
        mood,
        left: random(i + moodIndex * 17) * 96,
        top: mood === "shooting-star" ? 12 + random(i + 22) * 20 : 16 + random(i + 44) * 68,
        delay: random(i + moodIndex * 31) * 8,
        duration: mood === "shooting-star" ? 4.5 : 8 + random(i + moodIndex * 13) * 10,
      })),
    );
  }, [state.particleMoods]);

  return (
    <div className="world-particles" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={`${particle.mood}-${particle.id}`}
          className={`world-particle world-particle-${particle.mood}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `-${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {MOOD_LABEL[particle.mood]}
        </span>
      ))}
    </div>
  );
}

