import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { DayNightState, ParticleMood } from "./DayNightController";

type Particle = {
  id: number;
  mood: ParticleMood;
  left: number;
  top: number;
  delay: number;
  duration: number;
};

type ShootingStar = {
  id: number;
  left: number;
  top: number;
  duration: number;
  distanceX: number;
  distanceY: number;
  rotation: number;
  trailLength: number;
};

const MOOD_LABEL: Record<ParticleMood, string> = {
  pollen: "·",
  butterflies: "◇",
  dust: "·",
  fireflies: "·",
  "shooting-star": "",
};

const PARTICLE_COUNT: Record<ParticleMood, number> = {
  pollen: 18,
  butterflies: 7,
  dust: 16,
  fireflies: 18,
  "shooting-star": 0,
};

function random(seed: number) {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
}

function createShootingStar(id: number): ShootingStar {
  const distanceX = 140 + Math.random() * 220;
  const distanceY = 48 + Math.random() * 110;

  return {
    id,
    left: 35 + Math.random() * 60,
    top: 4 + Math.random() * 27,
    duration: 0.65 + Math.random() * 0.9,
    distanceX,
    distanceY,
    rotation: Math.atan2(distanceY, -distanceX) * (180 / Math.PI),
    trailLength: 38 + Math.random() * 68,
  };
}

function RandomShootingStars({ enabled }: { enabled: boolean }) {
  const [star, setStar] = useState<ShootingStar | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStar(null);
      return;
    }

    let timerId = 0;
    let nextId = 0;
    let disposed = false;

    const scheduleNext = () => {
      const wait = 3_500 + Math.random() * 12_500;
      timerId = window.setTimeout(() => {
        if (disposed) return;
        setStar(createShootingStar(nextId++));
        scheduleNext();
      }, wait);
    };

    setStar(createShootingStar(nextId++));
    scheduleNext();

    return () => {
      disposed = true;
      window.clearTimeout(timerId);
    };
  }, [enabled]);

  if (!star) return null;

  return (
    <span
      key={star.id}
      className="world-particle world-particle-shooting-star"
      style={
        {
          left: `${star.left}%`,
          top: `${star.top}%`,
          animationDuration: `${star.duration}s`,
          "--shoot-x": `-${star.distanceX}px`,
          "--shoot-y": `${star.distanceY}px`,
          "--shoot-rotation": `${star.rotation}deg`,
          "--shoot-trail-length": `${star.trailLength}px`,
        } as CSSProperties
      }
    />
  );
}

export function WorldParticles({ state }: { state: DayNightState }) {
  const particles = useMemo<Particle[]>(() => {
    let id = 0;
    return state.particleMoods.flatMap((mood, moodIndex) =>
      Array.from({ length: PARTICLE_COUNT[mood] }, (_, i) => ({
        id: id++,
        mood,
        left: random(i + moodIndex * 17) * 96,
        top: 16 + random(i + 44) * 68,
        delay: random(i + moodIndex * 31) * 8,
        duration: 8 + random(i + moodIndex * 13) * 10,
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
      <RandomShootingStars enabled={state.particleMoods.includes("shooting-star")} />
    </div>
  );
}
